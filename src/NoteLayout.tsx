import {
  Navigate, // Là một component được sử dụng để chuyển hướng người dùng đến một đường dẫn khác trong ứng dụng
  Outlet, // Là một component được sử dụng để hiển thị các component con dựa trên định tuyến
  useOutletContext, // Là một hook được sử dụng để truy cập vào context được truyền từ component cha chứa Outlet
  useParams, // Là một hook được sử dụng để lấy các tham số định tuyến. Nó trả về một đối tượng chứa các tham số định tuyến được trích xuất từ URL, cho phép bạn truy cập vào các giá trị đó trong component.
} from "react-router-dom";
import { Note } from "./App";

type NoteLayoutProps = {
  notes: Note[]; // Kiểu dữ liệu props của NoteLayout, là một mảng các Note
};

export function NoteLayout({ notes }: NoteLayoutProps) {
  const { id } = useParams(); // Lấy id từ định tuyến
  const note = notes.find((n) => n.id === id); // Tìm note tương ứng với id

  if (note == null) return <Navigate to="/" replace />; // Nếu note không tồn tại, chuyển hướng đến trang chủ

  return <Outlet context={note} />; // Hiển thị component con dựa trên định tuyến
}

export function useNote() {
  return useOutletContext<Note>(); // Sử dụng context của NoteLayout thông qua hook useOutletContext
}
