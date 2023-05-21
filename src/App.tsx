import "bootstrap/dist/css/bootstrap.min.css";
import {
  // chỉ chạy khi một trong các thành phần được cập nhật, giữ cho thành phần chạy không cần thiết
  useMemo,
} from "react";
import { Container } from "react-bootstrap";
import {
  // Định nghĩa các tuyến và liên kết chúng với các thành phần React tương ứng
  // Một thành phần dùng để xác định các tuyến (routes) trong ứng dụng
  Routes,
  // Thành phần dùng để xác định một tuyến cụ thể trong ứng dụng
  Route,
  // Thành phần dùng để thực hiện chuyển hướng (navigation) trong ứng dụng
  Navigate,
} from "react-router-dom"; // Hỗ trợ đẻ quản lý các tuyến và chuyển hướng giữa các trang ứng dụng
import { NewNote } from "./NewNote";
import { useLocalStorage } from "./useLocalStorage";
import { v4 as uuidV4 } from "uuid"; // ung cấp các phương thức để tạo và làm việc với các chuỗi định dạng UUID duy nhất.
import { NoteList } from "./NoteList";
import { NoteLayout } from "./NoteLayout";
import { Note } from "./Note";
import { EditNote } from "./EditNote";

// Các kiểu dữ liệu cho việc lưu trữ và xử lý thông tin ghi chú

export type Note = {
  id: string;
} & NoteData; // Kế thừa từ các thuộc tính từ NoteData

export type RawNote = {
  id: string;
} & RawNoteData;

export type RawNoteData = {
  title: string;
  markdown: string;
  tagIds: string[];
};

export type NoteData = {
  title: string;
  markdown: string;
  tags: Tag[];
};

export type Tag = {
  id: string;
  label: string;
};

function App() {
  // useLocalStorage là một custom React Hook (tự tạo) được sử dụng để quản lý dữ liệu trong Local Storage của trình duyệt.
  // <RawNote[]> là một kiểu dữ liệu (type) cho notes, cho biết rằng notes sẽ lưu trữ một mảng các đối tượng ghi chú (notes).
  // "NOTES" là khóa (key) để lưu trữ và truy xuất dữ liệu trong Local Storage.
  const [notes, setNotes] = useLocalStorage<RawNote[]>("NOTES", []); // Lưu trữ ghi chú
  const [tags, setTags] = useLocalStorage<Tag[]>("TAGS", []); // Lưu trữ thẻ tag

  // Ghi chú với tag
  const notesWithTags = useMemo(() => {
    return notes.map((note) => {
      return {
        ...note,
        // Lọc các phần tử trong mảng tags trên một đối tượng note
        tags: tags.filter((tag) => note.tagIds.includes(tag.id)), // kiểm tra xem tag.id có tồn tại trong mảng note.tagIds hay không.
      };
    });
  }, [notes, tags]); // Chỉ gọi tính lại khi sự phụ thuộc notes và tags bị thay đổi

  // Tạo ghi chú
  function onCreateNote({
    tags, // Mảng các thẻ tag
    ...data // Thông tin đối tượng ghi chú
  }: NoteData) {
    // Cập nhật danh sách ghi chú
    setNotes((prevNotes) => {
      // Dữ liệu đối tượng ghi chú trước đó
      return [
        ...prevNotes, // Sao chép toàn bộ phần tử từ danh sách ghi chú hiện tại
        {
          ...data,
          id: uuidV4(),
          tagIds: tags.map((tag) => tag.id), // Mảng id các thẻ tag
        },
      ];
    });
  }

  // Thêm thẻ tag
  function addTag(tag: Tag) {
    setTags((prev) => [...prev, tag]);
  }

  // Cập nhật ghi chú
  function onUpdateNote(id: string, { tags, ...data }: NoteData) {
    setNotes((prevNotes) => {
      return prevNotes.map((note) => {
        if (note.id === id) {
          return { ...note, ...data, tagIds: tags.map((tag) => tag.id) };
        } else {
          return note;
        }
      });
    });
  }

  // Cập nhật thẻ tag
  function updateTag(id: string, label: string) {
    setTags((prevTags) => {
      return prevTags.map((tag) => {
        if (tag.id === id) {
          return { ...tag, label };
        } else {
          return tag;
        }
      });
    });
  }

  // Xóa ghi chú
  function onDeleteNote(id: string) {
    // id: note hiện tại
    setNotes((prevNotes) => {
      return prevNotes.filter((note) => {
        // note: các object thông tin của note
        return note.id !== id;
      });
    });
  }

  // Xóa thẻ tag
  function deleteTag(id: string) {
    setTags((prevTags) => {
      return prevTags.filter((tag) => tag.id !== id);
    });
  }

  return (
    <Container className="my-4">
      <Routes>
        <Route
          path="/"
          element={
            <NoteList
              availableTags={tags}
              notes={notesWithTags}
              onUpdateTag={updateTag}
              onDeleteTag={deleteTag}
            />
          }
        />
        <Route
          path="/new"
          element={
            <NewNote
              onSubmit={onCreateNote}
              onAddTag={addTag}
              availableTags={tags}
            />
          }
        />
        <Route
          path="/:id" // một tham số động mà giá trị của nó sẽ được cung cấp từ URL
          element={<NoteLayout notes={notesWithTags} />}
        >
          <Route
            index // tham động được cung cấp. Hiện tại đang là 1
            element={<Note onDelete={onDeleteNote} />}
          ></Route>
          <Route
            path="edit"
            element={
              <EditNote
                onSubmit={onUpdateNote}
                onAddTag={addTag}
                availableTags={tags}
              />
            }
          ></Route>
        </Route>
        <Route
          path="*" // Khi một URL không khớp với bất kỳ tuyến nào khác, tuyến này sẽ được áp dụng
          element={
            <Navigate to="/" /> // Là thuộc tính element của tuyến, xác định thành phần React sẽ được hiển thị khi đường dẫn trùng khớp với tuyến này
          }
        />
      </Routes>
    </Container>
  );
}

export default App;
