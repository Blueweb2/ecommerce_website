type SocialLinksCardProps = {
  form: {
    socialLinks?: {
      instagram?: string;
      facebook?: string;
      youtube?: string;
      pinterest?: string;
      twitter?: string;
    };
  };
  setForm: React.Dispatch<React.SetStateAction<any>>;
};

export default function SocialLinksCard({
  form,
  setForm,
}: SocialLinksCardProps) {
  const updateSocialLink = (field: string, value: string) => {
    setForm((prev: any) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [field]: value,
      },
    }));
  };

  const socialFields = [
    {
      key: "instagram",
      label: "Instagram",
      placeholder: "https://instagram.com/yourbrand",
      helper: "Fashion and lifestyle content.",
    },
    {
      key: "facebook",
      label: "Facebook",
      placeholder: "https://facebook.com/yourbrand",
      helper: "Brand page and community engagement.",
    },
    {
      key: "youtube",
      label: "YouTube",
      placeholder: "https://youtube.com/@yourbrand",
      helper: "Campaigns, lookbooks and videos.",
    },
    {
      key: "pinterest",
      label: "Pinterest",
      placeholder: "https://pinterest.com/yourbrand",
      helper: "Fashion inspiration and collections.",
    },
    {
      key: "twitter",
      label: "X (Twitter)",
      placeholder: "https://x.com/yourbrand",
      helper: "Brand announcements and updates.",
    },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 border-b border-slate-100 pb-4">
        <h2 className="text-lg font-semibold text-slate-900">
          Social Links
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Connect the brand's official social media profiles. These links can
          be displayed on designer pages and storefront brand profiles.
        </p>
      </div>

      <div className="space-y-5">
        {socialFields.map((social) => (
          <div key={social.key}>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              {social.label}
            </label>

            <input
              type="url"
              placeholder={social.placeholder}
              value={
                (form.socialLinks as any)?.[social.key] || ""
              }
              onChange={(e) =>
                updateSocialLink(social.key, e.target.value)
              }
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
            />

            <p className="mt-1 text-xs text-slate-500">
              {social.helper}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-xl border border-indigo-100 bg-indigo-50 p-3">
        <p className="text-xs text-indigo-700">
          Social profiles help customers discover the brand, verify
          authenticity, and engage with the designer outside the platform.
        </p>
      </div>
    </div>
  );
}