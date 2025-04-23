import { MatPaginatorIntl } from "@angular/material/paginator";


export function CustomPaginator() {
	const customPaginatorIntl = new MatPaginatorIntl();
	customPaginatorIntl.firstPageLabel = 'Trang đầu';
	customPaginatorIntl.itemsPerPageLabel = 'Số dòng mỗi trang';
	customPaginatorIntl.lastPageLabel = 'Trang cuối';
	customPaginatorIntl.nextPageLabel = 'Trang tiếp theo';
	customPaginatorIntl.previousPageLabel = 'Trang trước';
	customPaginatorIntl.getRangeLabel = (page: number, pageSize: number, length: number) => {
		if (length === 0 || pageSize === 0) {
			return `0 trong ${length}`;
		}
		length = Math.max(length, 0);
		const startIndex = page * pageSize;
		const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
		return `${startIndex + 1} - ${endIndex} của ${length}`;
	}
	return customPaginatorIntl;
}
