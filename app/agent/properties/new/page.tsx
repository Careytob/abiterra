// app/agent/properties/new/page.tsx
import PropertyForm from '@/app/admin/properties/PropertyForm';

export default function NewAgentPropertyPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-zinc-900">Add property</h1>
      <PropertyForm
        mode="create"
        apiBasePath="/api/agent/properties"
        uploadPath="/api/agent/upload-image"
        listPath="/agent/properties"
        showFeaturedToggle={false}
        moderationNotice="This listing will be reviewed before it appears on the site. You'll see its status here once it's approved."
      />
    </div>
  );
}
