"use client";

import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";

// ------------------- Mock Data -------------------
interface Category {
  id: number;
  name: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface Blog {
  id: number;
  title: string;
  slug: string;
  content: string;
  coverImage?: string;
  author: string;
  tags: string[];
  categoryId: number;
  status: "draft" | "published";
  createdAt: string;
  updatedAt: string;
  category?: {
    id: number;
    name: string;
  };
}

// ------------------- State Management -------------------

// ------------------- Tag Input -------------------
interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
}

const TagInput: React.FC<TagInputProps> = React.memo(({ tags, onChange }) => {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value);
    },
    []
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && inputValue.trim()) {
        e.preventDefault();
        onChange([...tags, inputValue.trim()]);
        setInputValue("");
      }
    },
    [inputValue, onChange]
  );

  const removeTag = useCallback(
    (indexToRemove: number) => {
      onChange(tags.filter((_, index) => index !== indexToRemove));
    },
    [tags, onChange]
  );

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag, index) => (
        <Badge
          key={index}
          variant="secondary"
          className="flex items-center gap-1"
        >
          {tag}
          <Button
            variant="ghost"
            size="sm"
            className="h-4 w-4 p-0 button-color"
            onClick={() => removeTag(index)}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </Badge>
      ))}
      <Input
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Add tag (press Enter)"
        className="flex-1 min-w-[200px]"
      />
    </div>
  );
});

// ------------------- Blog Form -------------------
interface BlogFormProps {
  formData: {
    title: string;
    slug: string;
    author: string;
    content: string;
    coverImage: string;
    tags: string[];
    categoryId: number;
    status: "draft" | "published";
  };
  categories: Category[];
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onSelectChange: (name: string, value: string | number) => void;
  onTagsChange: (tags: string[]) => void;
  onContentChange: (content: string) => void;
}

const BlogForm: React.FC<BlogFormProps> = React.memo(
  ({
    formData,
    categories,
    onChange,
    onSelectChange,
    onTagsChange,
    onContentChange,
  }) => {
    return (
      <div className="space-y-4">
        {/* Title */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="title" className="text-right">
            Title
          </Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={onChange}
            className="col-span-3"
            autoFocus
          />
        </div>

        {/* Slug */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="slug" className="text-right">
            Slug
          </Label>
          <Input
            id="slug"
            name="slug"
            value={formData.slug}
            onChange={onChange}
            className="col-span-3"
            disabled
          />
        </div>

        {/* Author */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="author" className="text-right">
            Author
          </Label>
          <Input
            id="author"
            name="author"
            value={formData.author}
            onChange={onChange}
            className="col-span-3"
          />
        </div>

        {/* Category */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="categoryId" className="text-right">
            Category
          </Label>
          <Select
            value={formData.categoryId.toString()}
            onValueChange={(value) =>
              onSelectChange("categoryId", parseInt(value))
            }
          >
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id.toString()}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Tags */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="tags" className="text-right">
            Tags
          </Label>
          <div className="col-span-3">
            <TagInput tags={formData.tags} onChange={onTagsChange} />
          </div>
        </div>

        {/* Cover Image */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="coverImage" className="text-right">
            Cover Image
          </Label>
          <Input
            id="coverImage"
            name="coverImage"
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                onSelectChange("coverImage", URL.createObjectURL(file));
              }
            }}
            className="col-span-3"
          />
          {formData.coverImage && (
            <img
              src={formData.coverImage}
              alt="Cover"
              className="col-span-3 w-full h-32 object-cover rounded"
            />
          )}
        </div>

        {/* Status */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="status" className="text-right">
            Status
          </Label>
          <Select
            value={formData.status}
            onValueChange={(value) => onSelectChange("status", value)}
          >
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Content */}
        <div className="grid grid-cols-4 items-start gap-4">
          <Label htmlFor="content" className="text-right pt-2">
            Content
          </Label>
          <div className="col-span-3">
            <RichTextEditor
              content={formData.content}
              onChange={onContentChange}
              placeholder="Enter rich content here"
            />
          </div>
        </div>
      </div>
    );
  }
);

// ------------------- Preview Modal -------------------
const PreviewModal: React.FC<{
  blog: Blog;
  open: boolean;
  onClose: () => void;
}> = ({ blog, open, onClose }) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Preview: {blog.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {blog.coverImage && (
            <img
              src={blog.coverImage}
              alt={blog.title}
              className="w-full h-48 object-cover rounded"
            />
          )}
          <h1 className="text-2xl font-bold">{blog.title}</h1>
          <p className="text-sm text-muted-foreground">By {blog.author}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {blog.tags.map((tag, index) => (
              <Badge key={index} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

// ------------------- Blogs Page -------------------
export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    coverImage: "",
    author: "",
    tags: [] as string[],
    categoryId: 1,
    status: "draft" as "draft" | "published",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<number | "all">("all");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "draft" | "published"
  >("all");

  // ------------------- Data Fetching -------------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [blogsResponse, categoriesResponse] = await Promise.all([
          fetch("/api/blogs"),
          fetch("/api/categories"),
        ]);

        if (blogsResponse.ok && categoriesResponse.ok) {
          const blogsData = await blogsResponse.json();
          const categoriesData = await categoriesResponse.json();

          // Parse tags from JSON string to array
          const blogsWithParsedTags = blogsData.map((blog: any) => ({
            ...blog,
            tags: JSON.parse(blog.tags || "[]"),
          }));

          setBlogs(blogsWithParsedTags);
          setCategories(categoriesData);
        } else {
          toast.error("Failed to fetch data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ------------------- Slug Generation -------------------
  useEffect(() => {
    if (formData.title) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
      setFormData((prev) => ({ ...prev, slug }));
    }
  }, [formData.title]);

  // ------------------- Filtering -------------------
  useEffect(() => {
    let filtered = blogs.filter((blog) =>
      blog.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filterCategory !== "all") {
      filtered = filtered.filter((blog) => blog.categoryId === filterCategory);
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter((blog) => blog.status === filterStatus);
    }

    setFilteredBlogs(filtered);
  }, [searchTerm, filterCategory, filterStatus, blogs]);

  // ------------------- Handlers -------------------
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleSelectChange = useCallback(
    (name: string, value: string | number) => {
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleTagsChange = useCallback((tags: string[]) => {
    setFormData((prev) => ({ ...prev, tags }));
  }, []);

  const handleContentChange = useCallback((content: string) => {
    setFormData((prev) => ({ ...prev, content }));
  }, []);

  const handleSubmit = async () => {
    try {
      const blogData = {
        title: formData.title,
        slug: formData.slug || `blog-${Date.now()}`,
        content: formData.content,
        coverImage: formData.coverImage,
        author: formData.author,
        tags: formData.tags,
        categoryId: formData.categoryId,
        status: formData.status,
      };

      if (isEdit && selectedBlog) {
        const response = await fetch(`/api/blogs/${selectedBlog.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(blogData),
        });

        if (response.ok) {
          // Refresh blogs data
          const blogsResponse = await fetch("/api/blogs");
          if (blogsResponse.ok) {
            const blogsData = await blogsResponse.json();
            const blogsWithParsedTags = blogsData.map((blog: any) => ({
              ...blog,
              tags: JSON.parse(blog.tags || "[]"),
            }));
            setBlogs(blogsWithParsedTags);
          }
          toast.success("Blog updated successfully");
        } else {
          toast.error("Failed to update blog");
        }
      } else {
        const response = await fetch("/api/blogs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(blogData),
        });

        if (response.ok) {
          // Refresh blogs data
          const blogsResponse = await fetch("/api/blogs");
          if (blogsResponse.ok) {
            const blogsData = await blogsResponse.json();
            const blogsWithParsedTags = blogsData.map((blog: any) => ({
              ...blog,
              tags: JSON.parse(blog.tags || "[]"),
            }));
            setBlogs(blogsWithParsedTags);
          }
          toast.success("Blog created successfully");
        } else {
          toast.error("Failed to create blog");
        }
      }

      setIsOpen(false);
      setIsEdit(false);
      setSelectedBlog(null);
      setFormData({
        title: "",
        slug: "",
        content: "",
        coverImage: "",
        author: "",
        tags: [],
        categoryId: categories.length > 0 ? categories[0].id : 1,
        status: "draft",
      });
    } catch (error) {
      console.error("Error submitting blog:", error);
      toast.error("Failed to save blog");
    }
  };

  const handleEdit = (blog: Blog) => {
    setSelectedBlog(blog);
    setFormData({ ...blog, coverImage: blog.coverImage ?? "" });
    setIsEdit(true);
    setIsOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/blogs/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Refresh blogs data
        const blogsResponse = await fetch("/api/blogs");
        if (blogsResponse.ok) {
          const blogsData = await blogsResponse.json();
          const blogsWithParsedTags = blogsData.map((blog: any) => ({
            ...blog,
            tags: JSON.parse(blog.tags || "[]"),
          }));
          setBlogs(blogsWithParsedTags);
        }
        toast.success("Blog deleted successfully");
      } else {
        toast.error("Failed to delete blog");
      }
    } catch (error) {
      console.error("Error deleting blog:", error);
      toast.error("Failed to delete blog");
    }
  };

  const handleToggleStatus = async (blog: Blog) => {
    try {
      const newStatus = blog.status === "draft" ? "published" : "draft";
      const response = await fetch(`/api/blogs/${blog.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: blog.title,
          slug: blog.slug,
          content: blog.content,
          coverImage: blog.coverImage,
          author: blog.author,
          tags: blog.tags,
          categoryId: blog.categoryId,
          status: newStatus,
        }),
      });

      if (response.ok) {
        // Refresh blogs data
        const blogsResponse = await fetch("/api/blogs");
        if (blogsResponse.ok) {
          const blogsData = await blogsResponse.json();
          const blogsWithParsedTags = blogsData.map((blog: any) => ({
            ...blog,
            tags: JSON.parse(blog.tags || "[]"),
          }));
          setBlogs(blogsWithParsedTags);
        }
        toast.success(`Blog ${newStatus} successfully`);
      } else {
        toast.error("Failed to update blog status");
      }
    } catch (error) {
      console.error("Error updating blog status:", error);
      toast.error("Failed to update blog status");
    }
  };

  // ------------------- Render -------------------
  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading blogs...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Blogs</h1>
        <Button onClick={() => setIsOpen(true)} disabled={loading}>
          <Plus className="mr-2 h-4 w-4" /> Create Blog
        </Button>
      </div>

      {/* Filters */}
      <div className="mb-6 space-y-4">
        <Input
          placeholder="Search blogs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <div className="flex gap-4">
          <Select
            value={filterCategory.toString()}
            onValueChange={(value) =>
              setFilterCategory(value === "all" ? "all" : parseInt(value))
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id.toString()}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filterStatus}
            onValueChange={(value) =>
              setFilterStatus(value as "all" | "draft" | "published")
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Blogs Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Tags</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredBlogs.map((blog) => {
            const category = categories.find((c) => c.id === blog.categoryId);
            return (
              <TableRow key={blog.id}>
                <TableCell className="font-medium">{blog.title}</TableCell>
                <TableCell>{blog.author}</TableCell>
                <TableCell>{category?.name || "Uncategorized"}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {blog.tags.map((tag, index) => (
                      <Badge key={index} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      blog.status === "published" ? "default" : "secondary"
                    }
                  >
                    {blog.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(blog)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setPreviewOpen(true);
                        setSelectedBlog(blog);
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleStatus(blog)}
                    >
                      {blog.status === "draft" ? (
                        <ToggleRight className="h-4 w-4" />
                      ) : (
                        <ToggleLeft className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(blog.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {/* Create/Edit Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEdit ? "Edit Blog" : "Create Blog"}</DialogTitle>
            <DialogDescription>
              {isEdit
                ? "Update the blog details."
                : "Fill in the details to create a new blog."}
            </DialogDescription>
          </DialogHeader>

          <BlogForm
            formData={formData}
            categories={categories}
            onChange={handleInputChange}
            onSelectChange={handleSelectChange}
            onTagsChange={handleTagsChange}
            onContentChange={handleContentChange}
          />

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {isEdit ? "Save Changes" : "Create Blog"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Modal */}
      <PreviewModal
        blog={selectedBlog || (formData as any)}
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
      />
    </div>
  );
}
