export default function Container({ children, maxWidth = 'xl', noPadding = false }) {
    const maxWidthClass = {
        sm: 'max-w-screen-sm', //640px
        md: 'max-w-screen-md', //768px
        lg: 'max-w-screen-lg', //1024px
        xl: 'max-w-screen-xl', //1280px
    }[maxWidth];

    return (
        <div className={`${maxWidthClass} mx-auto ${noPadding ? 'px-0' : 'px-4 sm:px-6 lg:px-8'}`}>
            {children}
        </div>
    );
}