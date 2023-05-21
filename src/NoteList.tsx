import { useMemo, useState } from "react";
import {
  Badge,
  Button,
  Card,
  Col,
  Form,
  Modal,
  Row,
  Stack,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import ReactSelect from "react-select";
import { Tag } from "./App";
import styles from "./NoteList.module.css";

// Định nghĩa kiểu dữ liệu
type SimplifiedNote = {
  tags: Tag[];
  title: string;
  id: string;
};

type NoteListProps = {
  availableTags: Tag[];
  notes: SimplifiedNote[];
  onDeleteTag: (id: string) => void;
  onUpdateTag: (id: string, label: string) => void;
};

type EditTagsModalProps = {
  show: boolean;
  availableTags: Tag[];
  handleClose: () => void;
  onDeleteTag: (id: string) => void;
  onUpdateTag: (id: string, label: string) => void;
};

export function NoteList({
  availableTags,
  notes,
  onUpdateTag,
  onDeleteTag,
}: NoteListProps) {
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]); // Trạng thái của thẻ tag
  const [title, setTitle] = useState(""); // Trạng thái của thẻ tiêu đề
  const [editTagsModalIsOpen, setEditTagsModalIsOpen] = useState(false);

  // Tìm kiếm theo tiêu đề
  const filteredNotes = useMemo(() => {
    // Lọc các phần tử trong mảng
    return notes.filter((note) => {
      return (
        (title === "" ||
          note.title.toLowerCase().includes(title.toLowerCase())) && // Tìm kiếm không phân biệt hoa thường
        (selectedTags.length === 0 || // ko có thẻ tag nào
          selectedTags.every(
            (
              tag // Phương thức every được gọi trên một mảng và trả về true nếu tất cả các phần tử trong mảng thỏa mãn một điều kiện nào đó
            ) =>
              note.tags.some(
                (
                  noteTag // Phương thức some được gọi trên một mảng và trả về true nếu có ít nhất một phần tử trong mảng thỏa mãn một điều kiện nào đó.
                ) => noteTag.id === tag.id
              )
          ))
      );
    });
  }, [title, selectedTags, notes]); // Gọi lại hàm khi sự phụ thuộc thay đổi
  return (
    <>
      <Row className="align-items-center mb-4">
        <Col>
          <h1>Notes</h1>
        </Col>
        <Col xs="auto">
          <Stack gap={2} direction="horizontal">
            <Link to="/new">
              <Button variant="primary">Create</Button>
            </Link>
            <Button
              onClick={() => setEditTagsModalIsOpen(true)}
              variant="outline-secondary"
            >
              Edit Tags
            </Button>
          </Stack>
        </Col>
      </Row>
      <Form>
        <Row className="mb-4">
          <Col>
            <Form.Group // Nhóm các phần tử biểu mẫu liên quan
              controlId="title" // id của nhóm phần tử
            >
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="tags">
              <Form.Label>Tags</Form.Label>
              <ReactSelect
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
      </Form>
      <Row xs={1} sm={2} lg={3} xl={4} className="g-3">
        {filteredNotes.map((note) => (
          <Col key={note.id}>
            <NoteCard id={note.id} title={note.title} tags={note.tags} />
          </Col>
        ))}
      </Row>
      <EditTagsModal
        onUpdateTag={onUpdateTag}
        onDeleteTag={onDeleteTag}
        show={editTagsModalIsOpen}
        handleClose={() => setEditTagsModalIsOpen(false)}
        availableTags={availableTags}
      />
    </>
  );
}

function NoteCard({ id, title, tags }: SimplifiedNote) {
  return (
    <Card
      as={Link} // Sử dụng thành phần Card như một thẻ Link
      to={`/${id}`} // Đường dẫn của liên kết được định nghĩa là `/${id}`
      className={`h-100 text-reset text-decoration-none ${styles.card}`} // Áp dụng các lớp CSS cho thành phần Card
    >
      <Card.Body // Thành phần con của Card, chứa nội dung của thẻ Card
      >
        <Stack
          gap={2} // Khoảng cách giữa các thành phần con là 2
          className="align-items-center justify-content-center h-100" // Căn giữa các thành phần con
        >
          <span className="fs-5">
            {
              title // Hiển thị tiêu đề ghi chú
            }
          </span>
          {tags.length > 0 && ( // Kiểm tra nếu có tags
            <Stack
              gap={1} // Khoảng cách giữa các thành phần con là 1
              direction="horizontal" // Xếp chồng các thành phần con theo chiều ngang
              className="justify-content-center flex-wrap" // Căn giữa nội dung và ngắn dòng nếu cần
            >
              {tags.map(
                (
                  tag // Vòng lặp để tạo các thẻ Badge từ mảng tags
                ) => (
                  <Badge className="text-truncate" key={tag.id}>
                    {tag.label}
                  </Badge>
                )
              )}
            </Stack>
          )}
        </Stack>
      </Card.Body>
    </Card>
  );
}

function EditTagsModal({
  availableTags,
  handleClose,
  show,
  onDeleteTag,
  onUpdateTag,
}: EditTagsModalProps) {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Tags</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Stack gap={2}>
            {availableTags.map((tag) => (
              <Row key={tag.id}>
                <Col>
                  <Form.Control
                    type="text"
                    value={tag.label}
                    onChange={(e) => onUpdateTag(tag.id, e.target.value)}
                  />
                </Col>
                <Col xs="auto">
                  <Button
                    onClick={() => onDeleteTag(tag.id)}
                    variant="outline-danger"
                  >
                    &times;
                  </Button>
                </Col>
              </Row>
            ))}
          </Stack>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
