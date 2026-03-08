import { VideoCameraIcon } from '@heroicons/react/24/outline'

export function VideoAIIcon(props: React.ComponentProps<'svg'>) {
    return (
        <div
            className={`relative flex items-center justify-center ${props.className || ''}`}
            style={{ width: props.width || 24, height: props.height || 24 }}
        >
            {/* Main Video Icon */}
            <VideoCameraIcon
                strokeWidth={props.strokeWidth}
                style={{ ...props.style, width: '100%', height: '100%' }}
                className="text-current"
            />

            {/* Bigger AWS Smile */}
            <svg
                viewBox="0 0 256 256"
                className="absolute -top-3 right-0.9  w-14  h-5"
                xmlns="https://www.svgrepo.com/svg/370653/social-amazon"
            >
                <path
                    d="M60 170c40 28 100 28 140-2"
                    stroke="#FF9900"
                    strokeWidth="18"
                    fill="none"
                    strokeLinecap="round"
                />
            </svg>
        </div>
    )
}