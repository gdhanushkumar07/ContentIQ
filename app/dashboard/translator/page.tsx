import { GlobeAltIcon } from "@heroicons/react/24/outline";
import TranslationForm from "@/components/TranslationForm";

export default function TranslatorPage() {
    return (
        <div className="space-y-8 max-w-6xl mx-auto h-full">
            <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(168,85,247,0.12)', border: '1px solid rgba(168,85,247,0.25)' }}>
                    <GlobeAltIcon style={{ width: 22, height: 22, color: '#a855f7' }} />
                </div>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white">Universal Translator</h1>
                    <p className="text-sm" style={{ color: '#A1A1AA' }}>Translate Audio and Text files across 50+ languages instantly</p>
                </div>
            </div>

            <TranslationForm />
        </div>
    );
}
