export default {
	data() {
		return {
      nickname: "",
      productName: "",
      content: "",
      selectList: [],
      commentList: [],
      date: "",
      dateArray: [],
			isShow: false,
			url: "",
			// 当前页数
			nowPage: 1,
			// 当前页条数
			nowSize: 10,
			// 总条数
			totalElements: 0
		}
	}
}