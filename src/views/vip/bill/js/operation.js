export default {
	methods: {
		// 分页处理
		initialPage(totalElements) {
		  this.totalElements = totalElements;
		},
		// 初始化资讯列表
		initialBillList(list) {
		  this.billList.splice(0);
		  list.forEach(value => {
		    this.billList.push(value);
		  });
		},
		// 获取资讯列表
		getBillList(page, size) {
		  this.$http_normal({
		    url: `/api/userBill/page?page=${page - 1}&size=${
		      size
		      }&sort=createTime,desc${this.searchVal ? `&nickname=${this.searchVal}` : ""}${this.category ? `&category=${this.category}` : ''}${this.type ? `&type=${this.type}` : ''}`,
		    method: "get"
		  }).then(result => {
		    const data = result.data;
		    this.initialPage(data.totalElements);
		    this.initialBillList(data.content);
		  });
		},
		getRowKey(row) {
		  return row.id;
		},
		handleSelectionChange(val) {
		  this.selectList = val;
		},
		// 重置
		refresh() {
      this.searchVal = ""
      this.category = ""
      this.type = ""
		  this.$refs.pagination.toFirstPage()
		},
		// 点击搜索
		search() {
		  this.$refs.pagination.toFirstPage()
		}
	}
}