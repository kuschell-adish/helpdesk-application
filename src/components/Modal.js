import Button from "./Button";

function Modal({ maxSize, isVisible, onClose, onSubmit, title, children, error, submitText, cancelText, isDanger, hasError, disableValue }) {
    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50" onClick={onClose}>
            <div className={`bg-white ${maxSize} w-full p-6 rounded-lg shadow-lg`} onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between justify-center items-center">
                    <p className="text-sm text-orange-500 font-semibold">{title}</p>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 font-semibold text-lg">
                        &times;
                    </button>
                </div>

                <div className="mt-4">
                    {children}
                    {hasError && (<p className="text-xs text-red-500 mt-1">{error}</p>)}
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
