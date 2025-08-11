"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Paginator = void 0;
class Paginator {
    static buildPagination(items, total_items, params) {
        const total_pages = Math.ceil(total_items / params.per_page);
        const next_page = params.page < total_pages ? params.page + 1 : null;
        const prev_page = params.page > 1 ? params.page - 1 : null;
        return {
            items,
            pagination: {
                total_items,
                page: params.page,
                per_page: params.per_page,
                total_pages,
                next_page,
                prev_page,
            },
        };
    }
}
exports.Paginator = Paginator;
