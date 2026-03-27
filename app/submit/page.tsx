import { SubmitForm } from '@/components/SubmitForm';

export default function SubmitPage() {
  return (
    <section className="site-shell page-section narrow">
      <div className="section-heading left">
        <div>
          <span className="eyebrow">Submit</span>
          <h1>Submit your TON project</h1>
          <p>Add your token to TonGemz for review and listing.</p>
        </div>
      </div>
      <SubmitForm />
    </section>
  );
}
