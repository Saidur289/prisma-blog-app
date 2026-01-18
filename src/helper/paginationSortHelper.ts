type IOptions = {
    page?: number | string,
    limit?: number | string,
    sortBy?: string,
    sortByOrder?: string
}
type IOptionsResult = {
page: number,
limit: number,
skip: number,
sortBy: string,
sortByOrder: string
}
const paginationSortHelper = (options: IOptions): IOptionsResult => {
     console.log(options);
     const page = Number(options.page) || 1;
     const limit = Number(options.limit) || 10;
     const skip = (page - 1) * limit;
     const sortBy: string = options.sortBy || "createdAt";
     const sortByOrder: string = options.sortByOrder || "desc";

     return {
        page,
        limit,
        skip,
        sortBy,
        sortByOrder
     }
}
export default paginationSortHelper