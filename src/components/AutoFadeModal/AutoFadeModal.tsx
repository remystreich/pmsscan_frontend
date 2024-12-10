interface AutoFadeModalProps {
   isVisible: boolean;

   children: React.ReactNode;
}

const AutoFadeModal: React.FC<AutoFadeModalProps> = ({ isVisible, children }) => {
   return (
      <div
         className={`${isVisible ? 'fixed' : 'hidden'} fixed inset-0 z-50 flex h-screen w-screen items-center justify-center bg-black/80`}
      >
         <div className="flex w-full max-w-lg items-center justify-center gap-2 rounded-md border border-border bg-background px-10 py-5">
            {children}
         </div>
      </div>
   );
};

export default AutoFadeModal;
