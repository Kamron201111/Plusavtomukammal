import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle } from '@/components/ui/dialog';
import { TrashIcon } from 'lucide-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface DeleteItemModalProps {
    item: { id: number; name?: string };
    onDelete: (id: number) => void; // Callback function to handle deletion
}

export default function DeleteItemModal({ item, onDelete }: DeleteItemModalProps) {
    const { t } = useTranslation();
    const [open, setOpen] = React.useState(false);

    const handleDelete = () => {
        onDelete(item.id); // Call the delete handler
        setOpen(false); // Close modal
    };

    return (
        <>
            {/* Trigger Button */}
            <button
                onClick={() => setOpen(true)}
                className="flex items-center justify-center rounded-md bg-red-500 px-3 py-2 text-sm font-medium text-white hover:bg-red-600 focus:ring-2 focus:ring-red-400 focus:outline-none dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-500"
                title={t('delete')}
            >
                <TrashIcon className="h-4 w-4" />
            </button>

            {/* Modal */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-md rounded-lg border bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-900 dark:shadow-none">
                    <DialogTitle className="text-gray-900 dark:text-gray-100">{t('modal.delete_title')}</DialogTitle>
                    <DialogDescription className="mt-2 mb-4 text-gray-700 dark:text-gray-300">
                        <p>{t('modal.delete_confirmation')}</p>
                        {item.name && (
                            <p className="font-medium">
                                {t('delete')} {item.name}
                            </p>
                        )}
                    </DialogDescription>

                    <DialogFooter className="flex justify-end gap-2">
                        <DialogClose asChild>
                            <Button
                                variant="secondary"
                                onClick={() => setOpen(false)}
                                className="bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700"
                            >
                                {t('cancel')}
                            </Button>
                        </DialogClose>

                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            className="bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
                        >
                            {t('delete')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
