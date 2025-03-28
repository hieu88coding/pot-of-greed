// src/routes/+page.server.ts
import type { PageServerLoad } from './$types';

import type { CardType } from '$lib/types/card';

export const load: PageServerLoad = async ({ url }) => {
	// Lấy các query params từ URL (nếu có)
	const sort = url.searchParams.get('sort') ?? undefined;
	const atkStart = url.searchParams.has('atkStart')
		? parseInt(url.searchParams.get('atkStart')!, 10)
		: undefined;
	const atkEnd = url.searchParams.has('atkEnd')
		? parseInt(url.searchParams.get('atkEnd')!, 10)
		: undefined;
	const defStart = url.searchParams.has('defStart')
		? parseInt(url.searchParams.get('defStart')!, 10)
		: undefined;
	const defEnd = url.searchParams.has('defEnd')
		? parseInt(url.searchParams.get('defEnd')!, 10)
		: undefined;
	const type = url.searchParams.get('type')?.split(',') ?? undefined;
	const race = url.searchParams.get('race')?.split(',') ?? undefined;
	const attribute = url.searchParams.get('attribute')?.split(',') ?? undefined;
	const name = url.searchParams.get('name') ?? undefined;
	const level = url.searchParams.has('level')
		? parseInt(url.searchParams.get('level')!, 10)
		: undefined;

	try {
		// Tạo query string cho API chỉ với các param có giá trị
		const apiParams = new URLSearchParams();
		if (sort) apiParams.set('sort', sort);
		if (atkStart !== undefined) apiParams.set('atk', 'gte' + atkStart.toString());
		if (atkEnd !== undefined) apiParams.set('atk', 'lte' + atkEnd.toString());
		if (defStart !== undefined) apiParams.set('def', 'gte' + defStart.toString());
		if (defEnd !== undefined) apiParams.set('def', 'lte' + defEnd.toString());
		if (type) apiParams.set('type', type.join(','));
		if (race) apiParams.set('race', race.join(','));
		if (attribute) apiParams.set('attribute', attribute.join(','));
		if (name) apiParams.set('fname', name);
		if (level !== undefined) apiParams.set('level', level.toString());
		console.log(apiParams.toString());
		const response = await fetch(
			`https://db.ygoprodeck.com/api/v7/cardinfo.php?${apiParams.toString()}`
		);
		if (!response.ok) {
			console.log(response.json);
			return {
				items: []
			};
		}
		const cards = await response.json();
		let items: CardType[] = cards.data;
		return {
			items
		};
	} catch (error) {
		console.error('Error fetching cards:', error);
		return {
			items: []
		};
	}
};
