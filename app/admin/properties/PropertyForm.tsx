// app/admin/properties/PropertyForm.tsx
'use client';

import { useState } from 'react';
import { siteConfig, priceLabel, areaUnitLabel } from '@/lib/site-config';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import Image from 'next/image';
import { X } from 'lucide-react';
import { Input } from '@/app/components/ui/input';
import { Textarea } from '@/app/components/ui/textarea';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { propertyInputSchema, type PropertyInput } from '@/app/api/admin/properties/schema';

type ImageState = {
  id?: string; // present for images already saved to the property
  url: string;
  filepath: string;
  imagetype: string;
  ismain: boolean;
};

export type PropertyFormInitialData = Partial<PropertyInput> & {
  id?: string;
  images?: ImageState[];
};

export default function PropertyForm({
  mode,
  initialData,
  apiBasePath = '/api/admin/properties',
  uploadPath = '/api/admin/upload-image',
  listPath = '/admin/properties',
  moderationNotice,
  showFeaturedToggle = true,
}: {
  mode: 'create' | 'edit';
  initialData?: PropertyFormInitialData;
  apiBasePath?: string;
  uploadPath?: string;
  listPath?: string;
  moderationNotice?: string;
  showFeaturedToggle?: boolean;
}) {
  const router = useRouter();
  const [images, setImages] = useState<ImageState[]>(initialData?.images ?? []);
  const [features, setFeatures] = useState<string[]>(initialData?.features ?? []);
  const [featureDraft, setFeatureDraft] = useState('');
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<PropertyInput>({
    resolver: zodResolver(propertyInputSchema),
    defaultValues: {
      title: initialData?.title ?? '',
      description: initialData?.description ?? '',
      location: initialData?.location ?? '',
      price: initialData?.price ?? undefined,
      type: initialData?.type ?? 'SALE',
      status: initialData?.status ?? 'AVAILABLE',
      availability: initialData?.availability ?? true,
      area: initialData?.area ?? undefined,
      bedrooms: initialData?.bedrooms ?? 0,
      bathrooms: initialData?.bathrooms ?? 0,
      bq: initialData?.bq ?? 0,
      toilets: initialData?.toilets ?? 0,
      city: initialData?.city ?? '',
      state: initialData?.state ?? '',
      latitude: initialData?.latitude ?? undefined,
      longitude: initialData?.longitude ?? undefined,
      isfeatured: initialData?.isfeatured ?? false,
      agentid: initialData?.agentid ?? 'admin',
    },
  });

  const titleValue = watch('title');
  const slugPreview = (titleValue || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    if (!slugPreview) {
      toast.error('Enter a title first so images can be filed under the right property');
      e.target.value = '';
      return;
    }
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('slug', slugPreview);
        formData.append('imageType', 'other');
        const res = await fetch(uploadPath, { method: 'POST', body: formData });
        const json = await res.json();
        if (!res.ok) {
          toast.error(json.error || `Failed to upload ${file.name}`);
          continue;
        }
        setImages((prev) => [
          ...prev,
          { url: json.url, filepath: json.filepath, imagetype: json.imagetype, ismain: prev.length === 0 },
        ]);
      }
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => {
      const next = prev.filter((_, i) => i !== index);
      if (next.length > 0 && !next.some((img) => img.ismain)) {
        next[0].ismain = true;
      }
      return next;
    });
  };

  const setMainImage = (index: number) => {
    setImages((prev) => prev.map((img, i) => ({ ...img, ismain: i === index })));
  };

  const addFeature = () => {
    const value = featureDraft.trim();
    if (value && !features.includes(value)) {
      setFeatures((prev) => [...prev, value]);
    }
    setFeatureDraft('');
  };

  const removeFeature = (index: number) => {
    setFeatures((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: PropertyInput) => {
    if (images.length === 0) {
      toast.error('Add at least one photo before saving');
      return;
    }
    setSubmitting(true);
    try {
      const payload = { ...data, images, features };
      const url = mode === 'create' ? apiBasePath : `${apiBasePath}/${initialData?.id}`;
      const method = mode === 'create' ? 'POST' : 'PATCH';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to save property');
      toast.success(mode === 'create' ? 'Property created' : 'Property updated');
      router.push(listPath);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save property');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {moderationNotice && (
        <div className="rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          {moderationNotice}
        </div>
      )}
      <Card>
        <CardHeader>
          <CardTitle>Basics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">Title</label>
            <Input {...register('title')} placeholder="4-Bedroom Detached Duplex in Ajah" />
            {mode === 'create' && slugPreview && (
              <p className="mt-1 text-xs text-zinc-400">URL: /properties/{slugPreview}</p>
            )}
            {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title.message}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">Description</label>
            <Textarea {...register('description')} rows={5} placeholder="Describe the property…" />
            {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700">Listing type</label>
              <select {...register('type')} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                <option value="SALE">For sale</option>
                <option value="RENT">For rent</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700">Status</label>
              <select {...register('status')} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                <option value="AVAILABLE">Available</option>
                <option value="PENDING">Pending</option>
                <option value="SOLD">Sold</option>
                <option value="RENTED">Rented</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700">{priceLabel()}</label>
              <Input type="number" step="any" {...register('price')} placeholder="250000" />
              {errors.price && <p className="mt-1 text-xs text-red-600">{errors.price.message}</p>}
            </div>
          </div>

          {showFeaturedToggle && (
            <label className="flex items-center gap-2 text-sm text-zinc-700">
              <input type="checkbox" {...register('isfeatured')} className="h-4 w-4 rounded border-gray-300" />
              Feature this property on the homepage
            </label>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Location</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">Full address / location</label>
            <Input {...register('location')} placeholder="123 Main Street, Downtown" />
            {errors.location && <p className="mt-1 text-xs text-red-600">{errors.location.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700">City</label>
              <Input {...register('city')} />
              {errors.city && <p className="mt-1 text-xs text-red-600">{errors.city.message}</p>}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700">State / Region</label>
              <Input {...register('state')} />
              {errors.state && <p className="mt-1 text-xs text-red-600">{errors.state.message}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700">Latitude (optional)</label>
              <Input type="number" step="any" {...register('latitude')} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700">Longitude (optional)</label>
              <Input type="number" step="any" {...register('longitude')} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700">Bedrooms</label>
              <Input type="number" {...register('bedrooms')} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700">Bathrooms</label>
              <Input type="number" {...register('bathrooms')} />
            </div>
            {siteConfig.features.showToilets && (
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-700">Toilets</label>
                <Input type="number" {...register('toilets')} />
              </div>
            )}
            {siteConfig.features.showBQ && (
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-700">BQ (boys' quarters)</label>
                <Input type="number" {...register('bq')} />
              </div>
            )}
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700">Area ({areaUnitLabel()})</label>
              <Input type="number" step="any" {...register('area')} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-3 flex gap-2">
            <Input
              value={featureDraft}
              onChange={(e) => setFeatureDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addFeature();
                }
              }}
              placeholder="e.g. Communal Swimming Pool — press Enter to add"
            />
            <Button type="button" variant="outline" onClick={addFeature}>
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {features.map((feature, i) => (
              <span
                key={`${feature}-${i}`}
                className="flex items-center gap-1 rounded-full bg-teal-50 px-3 py-1 text-sm text-teal-700"
              >
                {feature}
                <button type="button" onClick={() => removeFeature(i)} aria-label={`Remove ${feature}`}>
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Photos</CardTitle>
        </CardHeader>
        <CardContent>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={handleFileSelect}
            disabled={uploading}
            className="mb-4 block text-sm"
          />
          {uploading && <p className="mb-4 text-sm text-zinc-500">Uploading…</p>}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {images.map((img, i) => (
              <div key={img.filepath} className="relative overflow-hidden rounded-lg border">
                <div className="relative aspect-video">
                  <Image src={img.url} alt="" fill className="object-cover" unoptimized />
                </div>
                <div className="flex items-center justify-between gap-1 bg-white p-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setMainImage(i)}
                    className={img.ismain ? 'font-semibold text-teal-600' : 'text-zinc-500 hover:text-teal-600'}
                  >
                    {img.ismain ? 'Main photo' : 'Set as main'}
                  </button>
                  <button type="button" onClick={() => removeImage(i)} aria-label="Remove photo">
                    <X className="h-3.5 w-3.5 text-zinc-400 hover:text-red-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          {images.length === 0 && !uploading && (
            <p className="text-sm text-zinc-400">No photos yet — at least one is required.</p>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => router.push(listPath)}>
          Cancel
        </Button>
        <Button type="submit" variant="teal" disabled={submitting || uploading}>
          {submitting ? 'Saving…' : mode === 'create' ? 'Create property' : 'Save changes'}
        </Button>
      </div>
    </form>
  );
}
