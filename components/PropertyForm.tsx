'use client'
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card"

import { Loader2 } from "lucide-react"

export default function PropertyForm() {
  const [formData, setFormData] = useState({
  title: "",
  description: "",
  state: "",
  city: "",
  address: "",
  bedrooms: "",
  bathrooms: "",
  guests: "",
  amenities: [] as string[],
  propertyType: "",
  price: "",
  verificationRequested: false,
  images: [] as string[], // Cloudinary URLs
})
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  
  const MAX_IMAGES = 5;

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleCheckbox = (value: string) => {
    setFormData(prev => {
      const exists = prev.amenities.includes(value)
      return {
        ...prev,
        amenities: exists
          ? prev.amenities.filter(item => item !== value)
          : [...prev.amenities, value],
      }
    })
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  if (!e.target.files) return;

  const files = Array.from(e.target.files);
  const remainingSlots = MAX_IMAGES - formData.images.length;

  if (remainingSlots <= 0) {
    alert(`You can only upload up to ${MAX_IMAGES} images.`);
    return;
  }

  const limitedFiles = files.slice(0, remainingSlots);
  const uploadedUrls: string[] = [];

  setUploading(true); // show spinner

  for (const file of limitedFiles) {
    const formDataToSend = new FormData();
    formDataToSend.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formDataToSend,
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      uploadedUrls.push(data.secure_url);
    } catch (err) {
      console.error("Image upload error:", err);
      alert("Image upload failed.");
    }
  }

  setUploading(false); // hide spinner

  setFormData(prev => ({
    ...prev,
    images: [...prev.images, ...uploadedUrls],
  }));

  // Optional: Clear file input (for UX)
  e.target.value = "";
};


const handleRemoveImage = (index: number) => {
  setFormData(prev => ({
    ...prev,
    images: prev.images.filter((_, i) => i !== index),
  }));

  setPreviews(prev => prev.filter((_, i) => i !== index));
};


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const res = await fetch("/api/properties", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })

    if (res.ok) alert("✅ Property submitted successfully!")
    else alert("❌ Failed to submit property.")
  }

  return (
    <main className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Property Listing Form</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input value={formData.title} onChange={e => handleChange("title", e.target.value)} />
            </div>
            <div>
  <Label>Upload Images</Label>
  <Input
    type="file"
    multiple
    onChange={handleFileChange}
    disabled={formData.images.length >= MAX_IMAGES}
  />
  {uploading && (
  <div className="flex items-center gap-2 text-blue-500 mt-2">
    <Loader2 className="w-4 h-4 animate-spin" />
    <span>Uploading...</span>
  </div>
)}

  {formData.images.length >= MAX_IMAGES && (
    <p className="text-sm text-red-500">
      You’ve reached the maximum of {MAX_IMAGES} images.
    </p>
  )}
  {uploading && <p className="text-sm text-blue-500">Uploading...</p>}

  {uploading && (
  <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
    <svg
      className="animate-spin h-5 w-5 text-blue-500"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4l3.5-3.5L12 0v4a8 8 0 01-8 8z"
      ></path>
    </svg>
    Uploading images...
  </div>
)}

  <div className="flex flex-wrap gap-4 mt-4">
    {previews.map((url, index) => (
      <div key={index} className="relative w-32 h-32">
        <img
          src={url}
          alt={`Preview ${index + 1}`}
          className="w-full h-full object-cover rounded"
        />
        <button
          type="button"
          onClick={() => handleRemoveImage(index)}
          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
        >
          ×
        </button>
      </div>
    ))}
  </div>
</div>

            {/* Add other fields like description, state, city, etc. */}
            <Button type="submit" className="w-full">Submit Property</Button>
          </CardContent>
        </Card>
      </form>
    </main>
  )
}
 
