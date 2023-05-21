import {
  useEffect // Hook của React được sử dụng để thực hiện các tác vụ phụ như gọi API hoặc tương tác với DOM.
  , useState
} from "react"

/* 
  Giải thích 'T':
  - Là một generic type parameter trong custom hook 
  - Làm việc nhiều kiểu dữ liệu khác nhau
  - `Generic type parameter`: 
    - Định nghĩa một tham số kiểu dữ liệu linh hoạt khi sử dụng hook đó. 
    - Nó cho phép chúng ta parametrize (tham số hóa) kiểu dữ liệu mà hook sẽ làm việc với, giúp tái sử dụng code và tăng tính linh hoạt của hook.
*/
export function useLocalStorage<T>(
  key: string, // tên của khoá trong localStorage
  initialValue: T | (() => T) // giá trị ban đầu của dữ liệu (có thể là giá trị cụ thể hoặc một hàm trả về giá trị).
) {
  // Quản lý giá trị 
  const [value, setValue] = useState<T>(() => {
    // Lấy dữ liệu ở local
    const jsonValue = localStorage.getItem(key)
    // Nếu ko có dữ liệu
    if (jsonValue == null) {
      if (typeof initialValue === "function") {  // Nếu initialValue là một hàm 
        return (initialValue as () => T)() // Gọi hàm đó trả về 
      } else { // Ngược lại trả initialValue trực tiếp
        return initialValue
      }
    } else { // Nếu tồn giá dữ liệu trên local sẽ trả về dữ liệu trên local
      return JSON.parse(jsonValue)
    }
  })

  // Lưu giá trị vào local
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value)) // Lưu giá trị mới 
  }, [value, key]) // dependency array là [value, key] để theo dõi sự thay đổi của value hoặc key.

  // Để trả về giá trị value và hàm setter setValue dưới dạng một mảng.
  // as được sử dụng để thực hiện một phép ép kiểu (type casting) trong TypeScript.
  return [value, setValue] as [T, typeof setValue]
}
