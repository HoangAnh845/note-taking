import { FormEvent, useRef, useState } from "react";
import { Button, Col, Form, Row, Stack } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
// Tạo lựa chọn tùy chỉnh trong thành phần chọn.
// Nó cung cấp khả năng cho phép người dùng nhập và tạo mới các tùy chọn mà không cần phải chọn từ danh sách có sẵn
import CreatableReactSelect from "react-select/creatable";
import { NoteData, Tag } from "./App";
import { v4 as uuidV4 } from "uuid";

// Xử lý dữ liệu khi sự kiện form được gửi đi
type NoteFormProps = {
  onSubmit: (data: NoteData) => void; // Giá trị không được trả về
  onAddTag: (tag: Tag) => void;
  availableTags: Tag[];
} & Partial<NoteData>;

export function NoteForm({
  onSubmit,
  onAddTag,
  availableTags,
  title = "",
  markdown = "",
  tags = [],
}: NoteFormProps) {
  // Trỏ đến phần tử <input> trong DOM khi nó được tạo và sẽ giữ giá trị tham chiếu của nó cho các mục đích tương lai
  const titleRef = useRef<HTMLInputElement>(null); // <HTMLInputElement> kiểu dữ liệu của phần tử DOM mà ta muốn tham chiếu đến
  // Trỏ đến phần tử <textarea> trong DOM khi nó được tạo và sẽ giữ giá trị tham chiếu của nó cho các mục đích tương lai.
  const markdownRef = useRef<HTMLTextAreaElement>(null); // // <HTMLTextAreaElement> kiểu dữ liệu của phần tử DOM mà ta muốn tham chiếu đến
  const [selectedTags, setSelectedTags] = useState<Tag[]>(tags); // là kiểu dữ liệu của state selectedTags
  const navigate = useNavigate(); // Sử dụng hook useNavigate để lấy hàm navigate để chuyển hướng

  // Xử lý dữ liệu gửi đi
  function handleSubmit(
    // FormEvent đại diện cho sự kiện của biểu mẫu (form).
    // Kiểu FormEvent cung cấp các thuộc tính và phương thức để tương tác với biểu mẫu và dữ liệu liên quan
    e: FormEvent
  ) {
    e.preventDefault(); // Ngăn sự kiện gửi dữ liệu

    // Xử lý lấy thông tin dữ liệu nhập của thẻ DOM
    onSubmit({
      // Ký tự "!" sau current cho biết rằng giá trị này không được đảm bảo không phải là null hoặc undefined
      title: titleRef.current!.value,
      markdown: markdownRef.current!.value,
      tags: selectedTags,
    });
    navigate("/");
  }

  return (
    <Form // Tạo ra biểu mẫu
      onSubmit={handleSubmit}
    >
      <Stack
        gap={4} // Thành phần xếp chồng các thành phần với một các giữa chúng. Hiện tại khoảng cách là 4
      >
        <Row // Sử dụng để tạo ra hàng trong bố cục
        >
          <Col // Sự dụng để tạo cột trong bố cục
          >
            <Form.Group // Nhóm các phần tử biểu mẫu liên quan
              controlId="title" // id của nhóm phần tử
            >
              <Form.Label>Title</Form.Label>
              <Form.Control
                ref={titleRef}
                required // Chỉ định rằng đây là trường thông tin bắt buộc phải nhập
                defaultValue={title} // Thông tin mặc định
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="tags">
              <Form.Label>Tags</Form.Label>
              <CreatableReactSelect
                // Tham số là giá trị tùy chọn mới mà người dùng đã nhập
                onCreateOption={(label) => {
                  const newTag = { id: uuidV4(), label };
                  onAddTag(newTag);
                  setSelectedTags((prev) => [...prev, newTag]);
                }}
                // Cung cấp danh sách các tùy chọn của thành phần
                options={availableTags.map((tag) => {
                  return { label: tag.label, value: tag.id };
                })}
                // Dữ liệu hiện tại
                value={selectedTags.map((tag) => {
                  return { label: tag.label, value: tag.id };
                })}
                // Nếu dữ liệu bị thay đổi
                onChange={(tags) => {
                  setSelectedTags(
                    tags.map((tag) => {
                      return { label: tag.label, id: tag.value };
                    })
                  );
                }}
                isMulti // người dùng có thể chọn một hoặc nhiều tùy chọn từ danh sách đó
              />
            </Form.Group>
          </Col>
        </Row>
        <Form.Group controlId="markdown">
          <Form.Label>Body</Form.Label>
          <Form.Control
            ref={markdownRef}
            required
            as="textarea"
            rows={15}
            defaultValue={markdown}
          />
        </Form.Group>
        <Stack
          gap={2}
          direction="horizontal" // xếp chồng từ trái sang phả
          className="justify-content-end"
        >
          <Button
            // className="me-3"
            type="submit"
            variant="primary" //Biến thể này áp dụng kiểu màu nền và kiểu chữ được xác định trước cho nút
          >
            Save
          </Button>
          <Link to="..">
            <Button type="button" variant="outline-secondary">
              Cancel
            </Button>
          </Link>
        </Stack>
      </Stack>
    </Form>
  );
}
