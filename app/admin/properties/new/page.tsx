// app/admin/properties/new/page.tsx
import PropertyForm from '../PropertyForm';

export default function NewPropertyPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-zinc-900">Add property</h1>
      <PropertyForm mode="create" />
    </div>
  );
}
