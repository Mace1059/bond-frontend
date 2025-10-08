export function detectLanguage(fileName: string): string {
  if (fileName.endsWith(".ts") || fileName.endsWith(".tsx")) return "typescript";
  if (fileName.endsWith(".js") || fileName.endsWith(".jsx")) return "javascript";
  if (fileName.endsWith(".json")) return "json";
  if (fileName.endsWith(".html")) return "html";
  if (fileName.endsWith(".css")) return "css";
  return "plaintext";
}

export async function loadMainFile(setCode: (code: string) => void, setLanguage: (lang: string) => void) {
  try {
    // Let user pick the file directly — or you could hardcode a path here
    const [fileHandle] = await (window as any).showOpenFilePicker();
    const file = await fileHandle.getFile();
    const text = await file.text();
    setCode(text);
    setLanguage(detectLanguage(file.name));
  } catch (err) {
    console.warn("Main file open cancelled or failed:", err);
  }
}