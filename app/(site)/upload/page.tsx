import { UploadForm } from "@/components/UploadForm"

export default function UploadPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-2xl font-bold">Upload Notes</h1>
      <UploadForm />
    </div>
  )
}
