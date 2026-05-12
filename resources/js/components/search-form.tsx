import { Role, SearchData } from '@/types';
import { format } from 'date-fns';
import { Search } from 'lucide-react';
import { ChangeEvent, FormEvent } from 'react';
import DatePicker from 'react-datepicker';
import { useTranslation } from 'react-i18next';

interface SearchFormProps {
    handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
    setData: <K extends keyof SearchData>(key: K, value: SearchData[K]) => void;
    data: SearchData;
    roles?: Role[];
}

const SearchForm = ({ handleSubmit, setData, data, roles }: SearchFormProps) => {
    const { t } = useTranslation(); // Hook to access translations

    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        setData('search', e.target.value);
    };

    const handleMonth = (e: ChangeEvent<HTMLInputElement>) => {
        setData('month', e.target.value);
    };

    const handlePerPageChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setData('per_page', parseInt(e.target.value, 10)); // parse as number
        setData('page', 1); // parse as number

        const form = e.target.closest('form');
        if (form) {
            // React state yangilanishidan keyin submit
            queueMicrotask(() => form.requestSubmit());
        }
    };

    const handleRoleChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setData('role', e.target.value);

        const form = e.target.closest('form');
        if (form) {
            // React state yangilanishidan keyin submit
            queueMicrotask(() => form.requestSubmit());
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {/*<div className="inline-flex rounded shadow-xs flex-wrap gap-y-1" role="group">*/}
            <div className="flex flex-col gap-2 rounded shadow-xs sm:gap-2 lg:inline-flex lg:flex-row lg:flex-wrap lg:gap-0 lg:gap-y-1" role="group">
                {/* Search Bar */}
                <input
                    type="text"
                    value={data.search}
                    onChange={handleSearch}
                    className="rounded border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:text-blue-700 focus:ring-2 focus:ring-blue-700 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white dark:focus:text-white dark:focus:ring-blue-500"
                    placeholder={t('search')}
                />

                {typeof data.total === 'number' && (
                    <select
                        value={data.per_page}
                        onChange={handlePerPageChange}
                        className="rounded border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:text-blue-700 focus:ring-2 focus:ring-blue-700 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white dark:focus:text-white dark:focus:ring-blue-500"
                    >
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                        <option value={data.total}>{t('pagination_optionAll')}</option>
                    </select>
                )}

                <div className={'flex-column items-center justify-between'}>
                    {typeof data.from === 'string' && (
                        <DatePicker
                            id="from-date"
                            placeholderText={t('from')}
                            value={data.from}
                            onChange={(from) => {
                                setData('from', from ? format(from, 'yyyy-MM-dd') : '');
                            }}
                            className="rounded border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:text-blue-700 focus:ring-2 focus:ring-blue-700 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white dark:focus:text-white dark:focus:ring-blue-500"
                        />
                    )}

                    {typeof data.to === 'string' && (
                        <DatePicker
                            id="to-date"
                            placeholderText={t('to')}
                            value={data.to}
                            onChange={(to) => {
                                setData('to', to ? format(to, 'yyyy-MM-dd') : '');
                            }}
                            className="rounded border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:text-blue-700 focus:ring-2 focus:ring-blue-700 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white dark:focus:text-white dark:focus:ring-blue-500"
                        />
                    )}
                </div>

                {typeof data.month === 'string' && (
                    <input
                        type="month"
                        value={data.month}
                        max={format(new Date(), 'yyyy-MM')}
                        onChange={handleMonth}
                        className="rounded border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:text-blue-700 focus:ring-2 focus:ring-blue-700 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white dark:focus:text-white dark:focus:ring-blue-500"
                        placeholder={t('month')}
                    />
                )}

                {typeof data.date === 'string' && (
                    <DatePicker
                        id="date"
                        placeholderText={t('date')}
                        value={data.date}
                        onChange={(date) => {
                            setData('date', date ? format(date, 'yyyy-MM-dd') : '');
                        }}
                        className="rounded border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:text-blue-700 focus:ring-2 focus:ring-blue-700 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white dark:focus:text-white dark:focus:ring-blue-500"
                    />
                )}

                {roles && (
                    <select
                        value={data.role || ''}
                        onChange={handleRoleChange}
                        className="rounded border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:text-blue-700 focus:ring-2 focus:ring-blue-700 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white dark:focus:text-white dark:focus:ring-blue-500"
                    >
                        {data.role}
                        <option value="0">{t('role')}</option>
                        {roles.map((role) => (
                            <option key={role.id} value={role.name}>
                                {role.name}
                            </option>
                        ))}
                    </select>
                )}

                {typeof data.is_bot_blocked === 'string' && (
                    <select
                        value={data.is_bot_blocked}
                        onChange={(e) => {
                            setData('is_bot_blocked', e.target.value);
                            const form = e.target.closest('form');
                            if (form) queueMicrotask(() => form.requestSubmit());
                        }}
                        className="rounded border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:text-blue-700 focus:ring-2 focus:ring-blue-700 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white dark:focus:text-white dark:focus:ring-blue-500"
                    >
                        <option value="">{t('bot_status', 'Bot holati')}</option>
                        <option value="1">{t('bot_blocked', 'Bloklagan')}</option>
                        <option value="0">{t('bot_active', 'Faol')}</option>
                    </select>
                )}

                {typeof data.get_prava === 'string' && (
                    <select
                        value={data.get_prava}
                        onChange={(e) => {
                            setData('get_prava', e.target.value);
                            const form = e.target.closest('form');
                            if (form) queueMicrotask(() => form.requestSubmit());
                        }}
                        className="rounded border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:text-blue-700 focus:ring-2 focus:ring-blue-700 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white dark:focus:text-white dark:focus:ring-blue-500"
                    >
                        <option value="">{t('prava_status', 'Prava holati')}</option>
                        <option value="1">{t('prava_yes', 'Olgan')}</option>
                        <option value="0">{t('prava_no', 'Olmagan')}</option>
                    </select>
                )}

                {/* Submit button to apply filter */}
                <button
                    type="submit"
                    className="flex items-center justify-center gap-2 rounded border border-gray-200 bg-blue-700 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-blue-800 hover:text-blue-700 focus:z-10 focus:text-blue-700 focus:ring-2 focus:ring-blue-700 focus:outline-none dark:border-gray-700 dark:bg-blue-600 dark:text-white dark:hover:bg-blue-700 dark:hover:text-white dark:focus:text-white dark:focus:ring-blue-800"
                >
                    <Search className="text-white dark:text-white" size={20} />
                    <span className="lg:hidden">{t('search')}</span>
                </button>
            </div>
        </form>
    );
};

export default SearchForm;
