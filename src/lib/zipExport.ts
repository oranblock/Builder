import JSZip from 'jszip';
import { ProjectTemplateFile, GeneratorOptions } from '../types';

export async function downloadProjectZip(
  files: ProjectTemplateFile[],
  options: GeneratorOptions
): Promise<void> {
  const zip = new JSZip();

  files.forEach((file) => {
    const content = file.getContent(options);
    zip.file(file.path, content);
  });

  const blob = await zip.generateAsync({ type: 'blob' });
  const filename = `${options.projectName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-blueprint.zip`;

  const downloadUrl = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = downloadUrl;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(downloadUrl);
}

export function downloadSingleFile(filename: string, content: string): void {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const downloadUrl = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = downloadUrl;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(downloadUrl);
}
