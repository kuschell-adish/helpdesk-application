import Button from "./Button";

function Modal({ isVisible, onClose, onSubmit, title, children, submitText, cancelText, isDanger, hasError, disableValue }) {
    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50" onClick={onClose}>
            <div className="bg-white w-full max-w-lg p-6 rounded-lg shadow-lg" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-end">
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                        &times;
                    </button>
                </div>

                <div className="mt-4">
                    <p>{title}</p>
                    {children}
                    {hasError && (<p className="text-xs text-red-500 mt-1">The comment field must contain at least three characters.</p>)}
                </div>

                <div className="w-full flex space-x-4">
                    <Button 
                        type="button"
                        label={cancelText || "Cancel"}
                        isPrimary={false}
                        onClick={onClose}
                    />
                    <Button 
                        type="submit"
                        label={submitText || "Submit"}
                        isPrimary={!isDanger}
                        isDanger={isDanger}   
                        onClick={onSubmit}
                        isDisabled={disableValue}
                    />
                </div>
            </div>
        </div>
    );
}

export default Modal
