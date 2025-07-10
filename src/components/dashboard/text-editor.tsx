"use client";

import type React from "react";

import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Toggle } from "@/components/ui/toggle";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Undo,
  Redo,
  Type,
} from "lucide-react";

interface TextEditorProps {
  initialContent?: string;
  onChange?: (content: string) => void;
  placeholder?: string;
  className?: string;
}

export function TextEditor({
  initialContent = "",
  onChange,
  placeholder = "Start typing...",
  className = "",
}: TextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [fontSize, setFontSize] = useState("16");
  const [alignment, setAlignment] = useState("left");

  const executeCommand = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  }, []);

  const handleFormat = useCallback(
    (command: string) => {
      executeCommand(command);
      updateToolbarState();
    },
    [executeCommand]
  );

  const handleFontSize = useCallback(
    (size: string) => {
      setFontSize(size);
      executeCommand("fontSize", "3");
      if (editorRef.current) {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          const span = document.createElement("span");
          span.style.fontSize = `${size}px`;
          try {
            range.surroundContents(span);
          } catch (e) {
            span.appendChild(range.extractContents());
            range.insertNode(span);
          }
        }
      }
    },
    [executeCommand]
  );

  const handleAlignment = useCallback(
    (align: string) => {
      setAlignment(align);
      const commands: { [key: string]: string } = {
        left: "justifyLeft",
        center: "justifyCenter",
        right: "justifyRight",
        justify: "justifyFull",
      };
      executeCommand(commands[align]);
    },
    [executeCommand]
  );

  const updateToolbarState = useCallback(() => {
    setIsBold(document.queryCommandState("bold"));
    setIsItalic(document.queryCommandState("italic"));
    setIsUnderline(document.queryCommandState("underline"));
  }, []);

  const handleInput = useCallback(() => {
    if (editorRef.current && onChange) {
      onChange(editorRef.current.innerHTML);
    }
    updateToolbarState();
  }, [onChange, updateToolbarState]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      // Handle common keyboard shortcuts
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case "b":
            e.preventDefault();
            handleFormat("bold");
            break;
          case "i":
            e.preventDefault();
            handleFormat("italic");
            break;
          case "u":
            e.preventDefault();
            handleFormat("underline");
            break;
          case "z":
            e.preventDefault();
            if (e.shiftKey) {
              executeCommand("redo");
            } else {
              executeCommand("undo");
            }
            break;
        }
      }
    },
    [handleFormat, executeCommand]
  );

  useEffect(() => {
    if (editorRef.current && initialContent) {
      editorRef.current.innerHTML = initialContent;
    }
  }, [initialContent]);

  return (
    <div className={`border rounded-lg overflow-hidden ${className}`}>
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 border-b bg-muted/50 flex-wrap">
        {/* Text Formatting */}
        <div className="flex items-center gap-1">
          <Toggle
            pressed={isBold}
            onPressedChange={() => handleFormat("bold")}
            size="sm"
            aria-label="Bold"
          >
            <Bold className="h-4 w-4" />
          </Toggle>
          <Toggle
            pressed={isItalic}
            onPressedChange={() => handleFormat("italic")}
            size="sm"
            aria-label="Italic"
          >
            <Italic className="h-4 w-4" />
          </Toggle>
          <Toggle
            pressed={isUnderline}
            onPressedChange={() => handleFormat("underline")}
            size="sm"
            aria-label="Underline"
          >
            <Underline className="h-4 w-4" />
          </Toggle>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Font Size */}
        <div className="flex items-center gap-2">
          <Type className="h-4 w-4" />
          <Select value={fontSize} onValueChange={handleFontSize}>
            <SelectTrigger className="w-16 h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="12">12</SelectItem>
              <SelectItem value="14">14</SelectItem>
              <SelectItem value="16">16</SelectItem>
              <SelectItem value="18">18</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="24">24</SelectItem>
              <SelectItem value="32">32</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Text Alignment */}
        <div className="flex items-center gap-1">
          <Toggle
            pressed={alignment === "left"}
            onPressedChange={() => handleAlignment("left")}
            size="sm"
            aria-label="Align Left"
          >
            <AlignLeft className="h-4 w-4" />
          </Toggle>
          <Toggle
            pressed={alignment === "center"}
            onPressedChange={() => handleAlignment("center")}
            size="sm"
            aria-label="Align Center"
          >
            <AlignCenter className="h-4 w-4" />
          </Toggle>
          <Toggle
            pressed={alignment === "right"}
            onPressedChange={() => handleAlignment("right")}
            size="sm"
            aria-label="Align Right"
          >
            <AlignRight className="h-4 w-4" />
          </Toggle>
          <Toggle
            pressed={alignment === "justify"}
            onPressedChange={() => handleAlignment("justify")}
            size="sm"
            aria-label="Justify"
          >
            <AlignJustify className="h-4 w-4" />
          </Toggle>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Lists */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleFormat("insertUnorderedList")}
            aria-label="Bullet List"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleFormat("insertOrderedList")}
            aria-label="Numbered List"
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Undo/Redo */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => executeCommand("undo")}
            aria-label="Undo"
          >
            <Undo className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => executeCommand("redo")}
            aria-label="Redo"
          >
            <Redo className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        className="min-h-[300px] p-4 focus:outline-none prose prose-sm max-w-none"
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onMouseUp={updateToolbarState}
        onKeyUp={updateToolbarState}
        style={{ fontSize: `${fontSize}px` }}
        suppressContentEditableWarning={true}
        data-placeholder={placeholder}
      />

      <style jsx>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}
