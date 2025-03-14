// RichTextEditor.js
import React, { useState } from 'react';
import { Editor } from '@tiptap/react';
import ReactDOM from 'react-dom/client';
import StarterKit from '@tiptap/starter-kit';
import { useEditor, EditorContent } from '@tiptap/react';
import Color from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';
import { Node, Extension  } from '@tiptap/core';
import HorizontalRule from '@tiptap/extension-horizontal-rule';

// Import icons
import * as Fa from 'react-icons/fa';
import * as Md from 'react-icons/md';
import * as Bi from 'react-icons/bi';
import * as Fi from 'react-icons/fi';
import * as Ai from 'react-icons/ai';

// Combine all icons
const ReactIcons = {
  ...Fa,
  ...Md,
  ...Bi,
  ...Fi,
  ...Ai
};

// Custom extension for icons
const CustomIcon = Node.create({
  name: 'customIcon',
  group: 'inline',
  inline: true,
  atom: true,

  addAttributes() {
    return {
      iconName: {
        default: '',
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-icon]',
        getAttrs: (element) => ({
          iconName: element.getAttribute('data-icon'),
        }),
      },
    ];
  },

  renderHTML({ node }) {
    return [
      'span', 
      { 
        'data-icon': node.attrs.iconName,
        'class': 'icon-placeholder'
      }
    ];
  },

  addNodeView() {
    return ({ node, editor }) => {
      const dom = document.createElement('span');
      dom.className = 'inline-flex items-center justify-center bg-blue-50 p-2 rounded-lg';
      
      let root = null;
      const IconComponent = ReactIcons[node.attrs.iconName];
      
      if (IconComponent) {
        const renderIcon = () => {
          // Only create root if it doesn't exist
          if (!root) {
            root = ReactDOM.createRoot(dom);
          }
          
          // Schedule render for next tick to avoid race conditions
          setTimeout(() => {
            if (root) {
              root.render(<IconComponent className="w-5 h-5 text-blue-600" />);
            }
          }, 0);
        };

        renderIcon();

        return {
          dom,
          update: (updatedNode) => {
            if (updatedNode.attrs.iconName !== node.attrs.iconName) {
              const NewIcon = ReactIcons[updatedNode.attrs.iconName];
              if (NewIcon) {
                setTimeout(() => {
                  if (root) {
                    root.render(<NewIcon className="w-5 h-5 text-blue-600" />);
                  }
                }, 0);
              }
            }
            return true;
          },
          destroy: () => {
            // Schedule unmount for next tick
            setTimeout(() => {
              if (root) {
                root.unmount();
                root = null;
              }
            }, 0);
          }
        };
      }
      
      return { dom };
    };
  },
});

// Icon Selector Component
const IconSelector = ({ onSelectIcon, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const iconCategories = {
    'Fa': Object.entries(Fa),
    'Md': Object.entries(Md),
    'Bi': Object.entries(Bi),
    'Fi': Object.entries(Fi),
    'Ai': Object.entries(Ai)
  };

  const categories = ['All', ...Object.keys(iconCategories)];

  const getFilteredIcons = () => {
    let icons = [];
    if (selectedCategory === 'All') {
      icons = Object.entries(ReactIcons);
    } else {
      icons = iconCategories[selectedCategory] || [];
    }

    return icons.filter(([name]) => 
      name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const filteredIcons = getFilteredIcons();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-4 w-96 max-h-[80vh] overflow-y-auto">
        <div className="sticky top-0 bg-white pb-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Select Icon</h3>
            <button 
              onClick={onClose} 
              className="text-gray-500 hover:text-gray-700"
              type="button"
            >
              ✕
            </button>
          </div>
          <input
            type="text"
            placeholder="Search icons..."
            className="w-full p-2 border rounded mb-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="w-full p-2 border rounded"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-4 gap-4 mt-4">
          {filteredIcons.map(([name, Icon]) => (
            <button
              key={name}
              type="button"
              onClick={() => {
                onSelectIcon(name);
                onClose();
              }}
              className="p-2 hover:bg-gray-100 rounded flex flex-col items-center"
            >
              <Icon className="text-2xl" />
              <span className="text-xs mt-1 truncate w-full text-center">
                {name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const FontSize = Extension.create({
  name: 'fontSize',

  addOptions() {
    return {
      types: ['textStyle'],
    }
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: element => element.style.fontSize?.replace('px', ''),
            renderHTML: attributes => {
              if (!attributes.fontSize) {
                return {}
              }

              return {
                style: `font-size: ${attributes.fontSize}px`,
              }
            },
          },
        },
      },
    ]
  },

  addCommands() {
    return {
      setFontSize: fontSize => ({ chain }) => {
        return chain()
          .setMark('textStyle', { fontSize })
          .run()
      },
      unsetFontSize: () => ({ chain }) => {
        return chain()
          .setMark('textStyle', { fontSize: null })
          .removeEmptyTextStyle()
          .run()
      },
    }
  },
});

// MenuBar Component
const MenuBar = ({ editor }) => {
  const [showIconSelector, setShowIconSelector] = useState(false);

  if (!editor) return null;

  const handleButtonClick = (callback) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    callback();
  };

  const handleIconSelect = (iconName) => {
    editor.chain().focus().insertContent({
      type: 'customIcon',
      attrs: { iconName },
    }).run();
  };

  // फ़ॉन्ट साइज़ के लिए options
  const fontSizeOptions = [
    { value: '12', label: '12px' },
    { value: '14', label: '14px' },
    { value: '16', label: '16px' },
    { value: '18', label: '18px' },
    { value: '20', label: '20px' },
    { value: '24', label: '24px' },
    { value: '28', label: '28px' },
    { value: '30', label: '30px' },
    { value: '32', label: '32px' },
    { value: '34', label: '34px' },
    { value: '36', label: '36px' },
    { value: '38', label: '38px' },
    { value: '40', label: '40px' },
  ];

  return (
    <div className="flex flex-wrap gap-2 p-2 border-b bg-slate-50">
      {/* Text Style Dropdown की जगह Font Size Dropdown */}
      <select
        onChange={(e) => {
          e.preventDefault();
          const size = e.target.value;
          if (size) {
            editor.chain().focus().setFontSize(size).run();
          }
        }}
        className="p-1 rounded border"
      >
        <option value="">Font Size</option>
        {fontSizeOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {/* Color Picker */}
      <input
        type="color"
        onChange={(e) => {
          e.preventDefault();
          editor.chain().focus().setColor(e.target.value).run();
        }}
        className="w-8 h-8 p-0 border rounded cursor-pointer"
      />

      {/* Text Formatting Buttons */}
      <button
        onClick={handleButtonClick(() => editor.chain().focus().toggleBold().run())}
        className={`p-2 rounded ${editor.isActive('bold') ? 'bg-slate-200' : 'hover:bg-slate-100'}`}
        type="button"
      >
        <strong>B</strong>
      </button>

      <button
        onClick={handleButtonClick(() => editor.chain().focus().toggleItalic().run())}
        className={`p-2 rounded ${editor.isActive('italic') ? 'bg-slate-200' : 'hover:bg-slate-100'}`}
        type="button"
      >
        <i>I</i>
      </button>

      <button
        onClick={handleButtonClick(() => editor.chain().focus().toggleUnderline().run())}
        className={`p-2 rounded ${editor.isActive('underline') ? 'bg-slate-200' : 'hover:bg-slate-100'}`}
        type="button"
      >
        <u>U</u>
      </button>

      {/* List Buttons */}
      <button
        onClick={handleButtonClick(() => editor.chain().focus().toggleBulletList().run())}
        className={`p-2 rounded ${editor.isActive('bulletList') ? 'bg-slate-200' : 'hover:bg-slate-100'}`}
        type="button"
      >
        •
      </button>

      <button
        onClick={handleButtonClick(() => editor.chain().focus().toggleOrderedList().run())}
        className={`p-2 rounded ${editor.isActive('orderedList') ? 'bg-slate-200' : 'hover:bg-slate-100'}`}
        type="button"
      >
        1.
      </button>

      {/* Horizontal Rule Button */}
      <button
        onClick={handleButtonClick(() => editor.chain().focus().setHorizontalRule().run())}
        className="p-2 rounded hover:bg-slate-100"
        type="button"
        title="Insert horizontal line"
      >
        ―
      </button>

      {/* Icon Button */}
      <button
        onClick={() => setShowIconSelector(true)}
        className="p-2 rounded hover:bg-slate-100"
        type="button"
      >
        Icon
      </button>

      {showIconSelector && (
        <IconSelector
          onSelectIcon={handleIconSelect}
          onClose={() => setShowIconSelector(false)}
        />
      )}
    </div>
  );
};

// RichTextEditor Component
const RichTextEditor = ({ value, onChange, placeholder }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          HTMLAttributes: {
            class: 'list-disc pl-4 mb-4'
          }
        },
        orderedList: {
          HTMLAttributes: {
            class: 'list-decimal pl-4 mb-4'
          }
        },
        paragraph: {
          HTMLAttributes: {
            class: 'mb-4'
          }
        },
        horizontalRule: {
          HTMLAttributes: {
            class: 'border-t border-gray-300 my-1'
          }
        }
      }),
      Color,
      TextStyle,
      Underline,
      CustomIcon,
      HorizontalRule,
      FontSize, 
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose max-w-none focus:outline-none min-h-[7rem] p-2',
      },
    },
  });
   // Custom CSS rules को define करें
   const customStyles = `
   .ProseMirror.prose hr {
    margin-top: 14px !important;
    margin-bottom: 14px !important;
     height: 1px !important;
   }
   
   /* Paragraphs के साथ consistent spacing */
   .ProseMirror.prose p + hr {
     margin-top: 0.5em !important;
   }
   
   .ProseMirror.prose hr + p {
     margin-top: 0.5em !important;
   }
 `;

  return (
    <div className="border rounded bg-slate-100" onClick={e => e.stopPropagation()}>
      <style>{customStyles}</style>
      <MenuBar editor={editor} />
      <EditorContent editor={editor} placeholder={placeholder} />
    </div>
  );
};

export default RichTextEditor;