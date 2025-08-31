"use client";

import { useState } from "react";
import RichTextEditor from "@/components/admin/text-editor";
import SimpleEditor from "@/components/admin/simple-editor";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function TestEditorPage() {
  const [richContent, setRichContent] = useState("");
  const [simpleContent, setSimpleContent] = useState("");
  const [savedContent, setSavedContent] = useState("");
  const [activeEditor, setActiveEditor] = useState("rich");

  const handleSave = () => {
    const content = activeEditor === "rich" ? richContent : simpleContent;
    setSavedContent(content);
    console.log("Kaydedilen içerik:", content);
  };

  const handleClear = () => {
    if (activeEditor === "rich") {
      setRichContent("");
    } else {
      setSimpleContent("");
    }
    setSavedContent("");
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Rich Text Editor Test</h1>

      <Tabs value={activeEditor} onValueChange={setActiveEditor}>
        <TabsList>
          <TabsTrigger value="rich">Rich Text Editor</TabsTrigger>
          <TabsTrigger value="simple">Simple TipTap</TabsTrigger>
        </TabsList>

        <TabsContent value="rich">
          <Card>
            <CardHeader>
              <CardTitle>Rich Text Editor (TipTap)</CardTitle>
            </CardHeader>
            <CardContent>
              <RichTextEditor
                initialContent={richContent}
                onChange={setRichContent}
                placeholder="Buraya yazın... Markdown shortcuts kullanabilirsiniz"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="simple">
          <Card>
            <CardHeader>
              <CardTitle>Simple TipTap Editor</CardTitle>
            </CardHeader>
            <CardContent>
              <SimpleEditor
                initialContent={simpleContent}
                onChange={setSimpleContent}
                placeholder="Basit rich text editor..."
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex gap-2">
        <Button onClick={handleSave}>İçeriği Kaydet</Button>
        <Button variant="outline" onClick={handleClear}>
          Temizle
        </Button>
      </div>

      {savedContent && (
        <Card>
          <CardHeader>
            <CardTitle>Kaydedilen HTML İçerik</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded text-sm overflow-auto">
              {savedContent}
            </pre>
          </CardContent>
        </Card>
      )}

      {savedContent && (
        <Card>
          <CardHeader>
            <CardTitle>Render Edilmiş Görünüm</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className="prose prose-lg dark:prose-invert max-w-full"
              dangerouslySetInnerHTML={{ __html: savedContent }}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
