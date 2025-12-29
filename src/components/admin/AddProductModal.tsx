"use client";

import { useState, FormEvent, useRef } from "react";
import { X, Upload, Image as ImageIcon } from "lucide-react";

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddProductModal({
  isOpen,
  onClose,
  onSuccess,
}: AddProductModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    stock: "",
    image_url: "",
  });
  const [imagePreview, setImagePreview] = useState<string>("");
  const [imageSource, setImageSource] = useState<"url" | "upload">("url");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = [
    "Rings",
    "Necklaces",
    "Earrings",
    "Bracelets",
    "Pendants",
    "Watches",
    "Other",
  ];

  // Convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  // Handle file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB");
      return;
    }

    try {
      setUploadedFile(file);
      const base64 = await fileToBase64(file);
      setImagePreview(base64);
      setFormData({ ...formData, image_url: base64 });
      setImageSource("upload");
      setError(null);
    } catch (err) {
      setError("Failed to process image. Please try again.");
    }
  };


  // Try to convert Google Share link to direct image URL
  const tryFetchImage = async (url: string) => {
    try {
      // For Google Share links, try to extract file ID and convert to direct link
      if (url.includes("share.google") || url.includes("drive.google")) {
        // Pattern 1: /d/FILE_ID/ or /file/d/FILE_ID/
        let match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
        if (!match) {
          // Pattern 2: id=FILE_ID
          match = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
        }
        if (match) {
          const fileId = match[1];
          // Convert to direct image link format
          const directUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;
          // Update preview immediately
          setImagePreview(directUrl);
          return directUrl;
        }
        // If we can't extract ID, return original URL but show warning
        return url;
      }
      return url;
    } catch (err) {
      return url;
    }
  };

  // Handle URL input with better Google Share link detection
  const handleUrlInput = async (url: string) => {
    setFormData({ ...formData, image_url: url });
    
    if (!url) {
      setImagePreview("");
      return;
    }

    // If it's already a base64 data URL, use it directly
    if (url.startsWith("data:image")) {
      setImagePreview(url);
      setImageSource("upload");
      return;
    }

    // Check if it's a Google Share link
    if (url.includes("share.google") || url.includes("drive.google")) {
      const convertedUrl = await tryFetchImage(url);
      setImagePreview(convertedUrl);
      setImageSource("url");
    } else {
      // Regular URL
      setImagePreview(url);
      setImageSource("url");
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.name || !formData.category || !formData.price || !formData.image_url) {
        setError("Please fill in all required fields");
        setLoading(false);
        return;
      }

      const price = parseFloat(formData.price);
      const stock = parseInt(formData.stock) || 0;

      if (isNaN(price) || price <= 0) {
        setError("Price must be a positive number");
        setLoading(false);
        return;
      }

      if (stock < 0) {
        setError("Stock cannot be negative");
        setLoading(false);
        return;
      }

      // If using URL and it's a Google Share link, try to convert it
      let finalImageUrl = formData.image_url;
      if (imageSource === "url" && formData.image_url.includes("share.google")) {
        finalImageUrl = await tryFetchImage(formData.image_url);
      }

      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description || null,
          category: formData.category,
          price: price,
          stock: stock,
          image_url: finalImageUrl, // Can be URL or base64
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create product");
      }

      // Reset form
      setFormData({
        name: "",
        description: "",
        category: "",
        price: "",
        stock: "",
        image_url: "",
      });
      setImagePreview("");
      setUploadedFile(null);
      setImageSource("url");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    if (e.target.name === "image_url") {
      handleUrlInput(e.target.value);
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-display font-bold text-gray-900">
            Add New Product
          </h2>
          <button
            onClick={onClose}
            className="text-neutral hover:text-gray-900 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-state-error/10 text-state-error p-4 rounded-lg">
              {error}
            </div>
          )}

          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-900 mb-2"
            >
              Product Name <span className="text-state-error">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="e.g., Diamond Solitaire Ring"
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-900 mb-2"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Product description..."
            />
          </div>

          {/* Category and Price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-900 mb-2"
              >
                Category <span className="text-state-error">*</span>
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-900 mb-2"
              >
                Price (₹) <span className="text-state-error">*</span>
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                step="1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="0"
              />
            </div>
          </div>

          {/* Stock */}
          <div>
            <label
              htmlFor="stock"
              className="block text-sm font-medium text-gray-900 mb-2"
            >
              Stock Quantity
            </label>
            <input
              type="number"
              id="stock"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="0"
            />
          </div>

          {/* Image Input - URL or Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Product Image <span className="text-state-error">*</span>
            </label>
            
            {/* Toggle between URL and Upload */}
            <div className="flex gap-2 mb-3">
              <button
                type="button"
                onClick={() => {
                  setImageSource("url");
                  setUploadedFile(null);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  imageSource === "url"
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-neutral hover:bg-gray-200"
                }`}
              >
                <ImageIcon className="w-4 h-4 inline mr-2" />
                Image URL
              </button>
              <button
                type="button"
                onClick={() => {
                  setImageSource("upload");
                  setFormData({ ...formData, image_url: "" });
                  fileInputRef.current?.click();
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  imageSource === "upload"
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-neutral hover:bg-gray-200"
                }`}
              >
                <Upload className="w-4 h-4 inline mr-2" />
                Upload Image
              </button>
            </div>

            {/* URL Input */}
            {imageSource === "url" && (
              <input
                type="url"
                id="image_url"
                name="image_url"
                value={formData.image_url}
                onChange={handleChange}
                required={imageSource === "url"}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="https://example.com/image.jpg or Google Share link"
              />
            )}

            {/* File Upload Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />

            {/* Show uploaded file name */}
            {uploadedFile && imageSource === "upload" && (
              <div className="mt-2 p-3 bg-gray-50 rounded-lg flex items-center justify-between">
                <span className="text-sm text-neutral">
                  {uploadedFile.name} ({(uploadedFile.size / 1024).toFixed(2)} KB)
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setUploadedFile(null);
                    setImagePreview("");
                    setFormData({ ...formData, image_url: "" });
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className="text-state-error hover:text-state-error/80 text-sm"
                >
                  Remove
                </button>
              </div>
            )}

            {/* Info text */}
            <p className="mt-2 text-xs text-neutral">
              {imageSource === "url"
                ? "Enter an image URL or Google Share link. For Google Drive links, we'll try to convert them to direct image links."
                : "Upload an image file (max 5MB). Images will be stored as base64 in the database."}
            </p>
          </div>

          {/* Image Preview */}
          {imagePreview && (
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Image Preview
              </label>
              <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden border border-gray-300">
                {imagePreview.startsWith("data:image") || 
                 imagePreview.startsWith("http") || 
                 imagePreview.startsWith("https") ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.style.display = "none";
                      const errorDiv = document.createElement("div");
                      errorDiv.className = "w-full h-full flex items-center justify-center text-neutral";
                      errorDiv.textContent = "Unable to load image preview";
                      target.parentElement?.appendChild(errorDiv);
                    }}
                    onLoad={(e) => {
                      // Hide any error messages if image loads successfully
                      const errorDiv = e.currentTarget.parentElement?.querySelector("div");
                      if (errorDiv && errorDiv.textContent?.includes("Unable")) {
                        errorDiv.remove();
                      }
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-neutral">
                    Invalid image source
                  </div>
                )}
              </div>
              {imagePreview.includes("share.google") && (
                <p className="mt-2 text-xs text-state-warning">
                  ⚠️ Google Share links may not preview correctly due to access restrictions. The image will be stored, but you may need to use a direct image URL for better compatibility.
                </p>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-neutral border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating..." : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
