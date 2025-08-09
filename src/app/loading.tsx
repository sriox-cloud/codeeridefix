export default function Loading() {
    return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 relative">
                    <div className="absolute inset-0 border-4 border-gray-700 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
                <div className="text-white font-bold text-xl mb-2" style={{ fontFamily: 'var(--font-gugi)' }}>
                    Codeer
                </div>
                <div className="text-gray-400 text-sm">
                    Loading your coding environment...
                </div>
            </div>
        </div>
    );
}
