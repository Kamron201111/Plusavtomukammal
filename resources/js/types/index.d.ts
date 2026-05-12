import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface ServerError {
    error?: string;
}

export interface Auth {
    user: User;
    roles: Role[];
}

export interface Role {
    id: number;
    name: string;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    phone: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;

    [key: string]: unknown;
}

export interface SearchData {
    search?: string;
    per_page?: number;
    page?: number;
    total?: number;
    from?: string;
    to?: string;
    month?: string;
    date?: string;
    daysInMonth?: number;
    role?: string;
    is_bot_blocked?: string;
    get_prava?: string;

    [key: string]: string | number | undefined; // Allow dynamic keys
}

export interface Link {
    active: string;
    label: string;
    url: string;
}

export interface UserPaginate {
    data: [User];
    search: string;
    per_page: number;
    from: number;
    to: number;
    total: number;
    current_page: number;
    last_page: number;
    links: [Link];
}

export interface User {
    id: number;
    name: string;
    username: string;
    email: string;
    phone: string;
    address: string;
    comment?: string;
    password: string;
    balance: number;
    avatar: string;
    email_verified_at: string | null;
    google_id: string | null;
    github_id: string | null;
    telegram_id: string | null;
    get_prava?: boolean;
    is_bot_blocked?: boolean;
    created_at: string;
    updated_at: string;
    roles?: Role[];

    attempts?: Attempt[];
    last_attempt?: Attempt;
    attempts_count?: number;
    attempts_sum_score?: number;
    attempts_sum_questions_count?: number;

    [key: string]: unknown;
}

export interface Role {
    id: number;
    name: string;
    guard_name: string;
    created_at: string;
    updated_at: string;
}

export interface TicketPaginate {
    data: [Ticket];
    search: string;
    per_page: number;
    from: number;
    to: number;
    total: number;
    current_page: number;
    last_page: number;
    links: [Link];
}

export interface Ticket {
    id: number;
    title: string;
    description: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    questions_count?: number;
    attempts_count?: number;
    questions: Question[];

    [key: string]: unknown;
}

export interface Question {
    id: number;
    ticket_id: number;
    content: string;
    description: string | null;
    image_url: string | null;
    created_at: string;
    updated_at: string;
    answers?: Answer[];

    [key: string]: unknown;
}

export interface Answer {
    id: number;
    question_id: number;
    content: string;
    is_correct: boolean;
    created_at: string;
    updated_at: string;

    [key: string]: unknown;
}

export interface Attempt {
    id: number;
    user_id: number;
    ticket_id: number;
    score: number;
    created_at: string;
    updated_at: string;
    finished_at: string | null;
    started_at: string | null;

    user?: User;
    ticket?: Ticket;
    attempt_answers?: AttemptAnswer[];

    [key: string]: unknown;
}

export interface AttemptPaginate {
    data: [Attempt];
    search: string;
    per_page: number;
    from: number;
    to: number;
    total: number;
    current_page: number;
    last_page: number;
    links: [Link];
}

export interface AttemptAnswer {
    id: number;
    attempt_id: number;
    question_id: number;
    answer_id: number;
    created_at: string;
    updated_at: string;

    question?: Question;
    answer?: Answer;

    [key: string]: unknown;
}

export interface StatItem {
    items_count: number;
    day_date: string;
    unique_users_count?: number;
}

export interface HourlyStatItem {
    items_count: number;
    unique_users_count: number;
    hour_of_day: number;
}

export interface WeeklyStatItem {
    weekday_number: number;
    items_count: number;
    unique_users_count: number;
}

export interface RoadLine {
    id: number;
    name: string;
    image_url: string;
    color: string;
    description: string;
    created_at?: string;
    updated_at?: string;
    [key: string]: unknown;
}

export interface RoadLinePaginate {
    data: RoadLine[];
    per_page: number;
    from: number;
    to: number;
    total: number;
    current_page: number;
    last_page: number;
    links: Link[];
}

export interface SignCategory {
    id: number;
    name: string;
    is_active: boolean;
    signs?: Sign[];
    signs_count?: number;
    created_at?: string;
    updated_at?: string;
    [key: string]: unknown;
}

export interface SignCategoryPaginate {
    data: SignCategory[];
    per_page: number;
    from: number;
    to: number;
    total: number;
    current_page: number;
    last_page: number;
    links: Link[];
}

export interface Sign {
    id: number;
    sign_category_id: number;
    content: string;
    image_url: string;
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
    [key: string]: unknown;
}

export interface Yhq {
    id: number;
    title: string;
    date: string | null;
    brv_amount: number | null;
    brv_description: string | null;
    discount_days: number | null;
    discount_percent: number | null;
    payment_deadline_regular: number | null;
    payment_deadline_camera: number | null;
    cancellation_if_no_decision_days: number | null;
    is_active: boolean;
    categories?: YhqCategory[];
    categories_count?: number;
    created_at?: string;
    updated_at?: string;
    [key: string]: unknown;
}

export interface YhqPaginate {
    data: Yhq[];
    per_page: number;
    from: number;
    to: number;
    total: number;
    current_page: number;
    last_page: number;
    links: Link[];
}

export interface YhqCategory {
    id: number;
    yhq_id: number;
    name: string;
    is_active: boolean;
    yhq?: Yhq;
    items?: YhqCategoryItem[];
    items_count?: number;
    created_at?: string;
    updated_at?: string;
    [key: string]: unknown;
}

export interface YhqCategoryItem {
    id: number;
    yhq_category_id: number;
    name: string;
    bhm: number | null;
    summa: number | null;
    summa_min: number | null;
    summa_max: number | null;
    discount_summa: number | null;
    penalty_points: number | null;
    description: string | null;
    additional_penalty: string | null;
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
    [key: string]: unknown;
}
