import { Badge, Button, Col, Row, Stack } from "react-bootstrap"; // Import các thành phần từ thư viện React Bootstrap
import { Link, useNavigate } from "react-router-dom"; // Import các thành phần từ thư viện React Router
import { useNote } from "./NoteLayout"; // Import custom hook từ module NoteLayout
import ReactMarkdown from "react-markdown";
// Markdown một ngôn ngữ đánh dấu (markup language) được tạo ra để đơn giản hóa quá trình viết và định dạng văn bản.
// Ngôn ngữ này được thiết kế để dễ dùng, dễ đọc và dễ viết bằng cách sử dụng cú pháp đơn giản, giúp người dùng tập trung vào việc viết nội dung thay vì lo lắng về định dạng.
// Ví dụ:
/* 
  <ReactMarkdown>
    **Text** // in đậm
    Text // Văm bản
  </ReactMarkdown>
*/

type NoteProps = {
  onDelete: (id: string) => void; // Kiểu dữ liệu cho props của component Note
};

export function Note({ onDelete }: NoteProps) {
  const note = useNote(); // Sử dụng custom hook useNote để lấy thông tin về ghi chú
  const navigate = useNavigate(); // Sử dụng hook useNavigate để lấy hàm navigate để chuyển hướng

  return (
    <>
      <Row className="align-items-center mb-4">
        <Col>
          <h1>{note.title}</h1> {/* Hiển thị tiêu đề ghi chú */}
          {note.tags.length > 0 && ( // Kiểm tra nếu ghi chú có nhãn
            <Stack gap={1} direction="horizontal" className="flex-wrap">
              {note.tags.map(
                (
                  tag // Hiển thị các nhãn ghi chú
                ) => (
                  <Badge className="text-truncate" key={tag.id}>
                    {tag.label}
                  </Badge>
                )
              )}
            </Stack>
          )}
        </Col>
        <Col xs="auto">
          <Stack gap={2} direction="horizontal">
            <Link to={`/${note.id}/edit`}>
              {" "}
              {/* Tạo đường dẫn tới trang chỉnh sửa ghi chú */}
              <Button variant="primary">Edit</Button>{" "}
              {/* Nút chỉnh sửa ghi chú */}
            </Link>
            <Button
              onClick={() => {
                onDelete(note.id); // Gọi hàm xóa ghi chú
                navigate("/"); // Chuyển hướng về trang chủ
              }}
              variant="outline-danger"
            >
              Delete {/* Nút xóa ghi chú */}
            </Button>
            <Link to="/">
              {" "}
              {/* Tạo đường dẫn về trang chủ */}
              <Button variant="outline-secondary">Back</Button>{" "}
              {/* Nút quay lại trang chủ */}
            </Link>
          </Stack>
        </Col>
      </Row>
      <ReactMarkdown>{note.markdown}</ReactMarkdown>
      {/* Hiển thị nội dung ghi chú dưới dạng Markdown */}
    </>
  );
}
