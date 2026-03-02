const BASE_URL = 'http://localhost:3000/api/v1';

export class ApiError extends Error {
code: string;
details?: { field: string; message: string }[];

constructor(
	code: string,
	message: string,
	details?: { field: string; message: string }[]
) {
	super(message);
	this.code = code;
	this.details = details;
}
}

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
const token = localStorage.getItem('ps_token');
const headers: Record<string, string> = {
	'Content-Type': 'application/json',
};
if (token) headers['Authorization'] = `Bearer ${token}`;

const res = await fetch(`${BASE_URL}${endpoint}`, {
	...options,
	headers: { ...headers, ...(options?.headers as Record<string, string> || {}) },
});

const json = await res.json();
if (!json.success) {
	throw new ApiError(
	json.error?.code || 'ERROR',
	json.error?.message || 'Request failed',
	json.error?.details
	);
}
return json.data as T;
}

// Auth
export const authApi = {
signIn: (email: string, password: string) =>
	request<{ user: User; accessToken: string; refreshToken: string }>('/auth/signin', {
	method: 'POST',
	body: JSON.stringify({ email, password }),
	}),

signUp: (data: SignUpData) =>
	request<{ user: User; accessToken: string; refreshToken: string }>('/auth/signup', {
	method: 'POST',
	body: JSON.stringify(data),
	}),

me: () => request<User>('/auth/me'),

updateProfile: (data: Partial<User>) =>
	request<User>('/auth/profile', {
	method: 'PATCH',
	body: JSON.stringify(data),
	}),

signOut: () =>
	request<{ message: string }>('/auth/signout', { method: 'POST' }),
};

// Tournaments
export const tournamentsApi = {
list: (params?: { sport?: Sport; status?: TournamentStatus; page?: number; limit?: number }) => {
	const q = new URLSearchParams();
	if (params?.sport) q.set('sport', params.sport);
	if (params?.status) q.set('status', params.status);
	if (params?.page) q.set('page', String(params.page));
	if (params?.limit) q.set('limit', String(params.limit));
	return request<Tournament[]>(`/tournaments?${q.toString()}`);
},

create: (data: CreateTournamentData) =>
	request<Tournament>('/tournaments', {
	method: 'POST',
	body: JSON.stringify(data),
	}),

getById: (id: string) => request<Tournament>(`/tournaments/${id}`),

getByInviteCode: (inviteCode: string) =>
	request<Tournament>(`/tournaments/join/${inviteCode}`),
};

// Types
export type Sport = 'cricket' | 'badminton' | 'volleyball';
export type TournamentStatus = 'draft' | 'open' | 'ongoing' | 'completed' | 'cancelled';

export interface User {
	id: string;
	phoneNumber: string;
	email: string;
	fullName: string;
	username?: string;
	avatarUrl?: string;
	bio?: string;
	status: string;
	role: string;
	createdAt: string;
	lastLoginAt?: string;
}

export interface Tournament {
	id: string;
	name: string;
	slug: string;
	description?: string;
	sportType: Sport;
	status: TournamentStatus;
	maxTeams: number;
	currentTeams: number;
	minPlayersPerTeam: number;
	maxPlayersPerTeam: number;
	startDate: string;
	endDate?: string;
	venue?: string;
	city?: string;
	inviteCode?: string;
	inviteLink?: string;
	allowPublicJoin: boolean;
	createdAt: string;
	creator?: { id: string; fullName: string; username?: string };
}

export interface SignUpData {
	phoneNumber: string;
	email: string;
	password: string;
	fullName: string;
	username: string;
}

export interface CreateTournamentData {
	name: string;
	description?: string;
	sportType: Sport;
	maxTeams: number;
	minPlayersPerTeam: number;
	maxPlayersPerTeam: number;
	startDate: string;
	endDate?: string;
	venue?: string;
	city?: string;
	country?: string;
	allowPublicJoin: boolean;
}
