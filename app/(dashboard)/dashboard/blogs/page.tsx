'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, Eye, ToggleLeft, ToggleRight } from 'lucide-react';

// ------------------- Mock Data -------------------
interface Category {
  id: number;
  name: string;
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
  status: 'draft' | 'published';
}

const mockCategories: Category[] = [
  { id: 1, name: 'Technology' },
  { id: 2, name: 'Lifestyle' },
  { id: 3, name: 'Web Development' },
];

const mockBlogs: Blog[] = [
  {
    id: 1,
    title: 'Introduction to Next.js',
    slug: 'introduction-to-next-js',
    content: 'Next.js is a React framework...',
    coverImage: '/placeholder-image.jpg',
    author: 'John Doe',
    tags: ['nextjs', 'react'],
    categoryId: 1,
    status: 'published',
  },
  {
    id: 2,
    title: 'Building SaaS Apps',
    slug: 'building-saas-apps',
    content: 'Tips for building scalable SaaS...',
    coverImage: '',
    author: 'Jane Smith',
    tags: ['saas', 'stripe'],
    categoryId: 2,
    status: 'draft',
  },
];

// ------------------- Tag Input -------------------
interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
}

const TagInput: React.FC<TagInputProps> = React.memo(({ tags, onChange }) => {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      onChange([...tags, inputValue.trim()]);
      setInputValue('');
    }
  };

  const removeTag = (indexToRemove: number) => {
    onChange(tags.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag, index) => (
        <Badge key={index} variant="secondary" className="flex items-center gap-1">
          {tag}
          <Button variant="ghost" size="sm" className="h-4 w-4 p-0" onClick={() => removeTag(index)}>
            <Trash2 className="h-3 w-3" />
          </Button>
        </Badge>
      ))}
      <Input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
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
    status: 'draft' | 'published';
  };
  categories: Category[];
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSelectChange: (name: string, value: string | number) => void;
  onTagsChange: (tags: string[]) => void;
}

const BlogForm: React.FC<BlogFormProps> = React.memo(
  ({ formData, categories, onChange, onSelectChange, onTagsChange }) => {
    return (
      <div className="space-y-4">
        {/* Title */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="title" className="text-right">
            Title
          </Label>
          <Input id="title" name="title" value={formData.title} onChange={onChange} className="col-span-3" />
        </div>

        {/* Slug */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="slug" className="text-right">
            Slug
          </Label>
          <Input id="slug" name="slug" value={formData.slug} onChange={onChange} className="col-span-3" disabled />
        </div>

        {/* Author */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="author" className="text-right">
            Author
          </Label>
          <Input id="author" name="author" value={formData.author} onChange={onChange} className="col-span-3" />
        </div>

        {/* Category */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="categoryId" className="text-right">
            Category
          </Label>
          <Select
            value={formData.categoryId.toString()}
            onValueChange={(value) => onSelectChange('categoryId', parseInt(value))}
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
                onSelectChange('coverImage', URL.createObjectURL(file));
              }
            }}
            className="col-span-3"
          />
          {formData.coverImage && (
            <img src={formData.coverImage} alt="Cover" className="col-span-3 w-full h-32 object-cover rounded" />
          )}
        </div>

        {/* Status */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="status" className="text-right">
            Status
          </Label>
          <Select
            value={formData.status}
            onValueChange={(value) => onSelectChange('status', value)}
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
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="content" className="text-right">
            Content
          </Label>
          <Textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={onChange}
            className="col-span-3 h-32"
            placeholder="Enter rich content here"
          />
        </div>
      </div>
    );
  }
);

// ------------------- Preview Modal -------------------
const PreviewModal: React.FC<{ blog: Blog; open: boolean; onClose: () => void }> = ({
  blog,
  open,
  onClose,
}) => (
  <Dialog open={open} onOpenChange={onClose}>
    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Preview: {blog.title}</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        {blog.coverImage && (
          <img src={blog.coverImage} alt={blog.title} className="w-full h-48 object-cover rounded" />
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
        <div className="prose max-w-none">{blog.content}</div>
      </div>
    </DialogContent>
  </Dialog>
);

// ------------------- Blogs Page -------------------
export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>(mockBlogs);
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>(mockBlogs);

  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    coverImage: '',
    author: '',
    tags: [] as string[],
    categoryId: 1,
    status: 'draft' as 'draft' | 'published',
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<number | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'draft' | 'published'>('all');

  // ------------------- Slug Generation -------------------
  useEffect(() => {
    if (formData.title) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
      setFormData((prev) => ({ ...prev, slug }));
    }
  }, [formData.title]);

  // ------------------- Filtering -------------------
  useEffect(() => {
    let filtered = blogs.filter((blog) =>
      blog.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filterCategory !== 'all') {
      filtered = filtered.filter((blog) => blog.categoryId === filterCategory);
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter((blog) => blog.status === filterStatus);
    }

    setFilteredBlogs(filtered);
  }, [searchTerm, filterCategory, filterStatus, blogs]);

  // ------------------- Handlers -------------------
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTagsChange = (tags: string[]) => {
    setFormData((prev) => ({ ...prev, tags }));
  };

  const handleSubmit = () => {
    if (isEdit && selectedBlog) {
      setBlogs(
        blogs.map((blog) =>
          blog.id === selectedBlog.id ? { ...formData, id: selectedBlog.id } : blog
        )
      );
    } else {
      const newBlog: Blog = {
        id: blogs.length + 1,
        ...formData,
        slug: formData.slug || `blog-${Date.now()}`,
      };
      setBlogs([...blogs, newBlog]);
    }
    setIsOpen(false);
    setIsEdit(false);
    setSelectedBlog(null);
    setFormData({
      title: '',
      slug: '',
      content: '',
      coverImage: '',
      author: '',
      tags: [],
      categoryId: 1,
      status: 'draft',
    });
  };

  const handleEdit = (blog: Blog) => {
    setSelectedBlog(blog);
    setFormData({ ...blog, coverImage: blog.coverImage ?? '' });
    setIsEdit(true);
    setIsOpen(true);
  };

  const handleDelete = (id: number) => {
    setBlogs(blogs.filter((blog) => blog.id !== id));
  };

  const handleToggleStatus = (blog: Blog) => {
    setBlogs(
      blogs.map((b) =>
        b.id === blog.id ? { ...b, status: b.status === 'draft' ? 'published' : 'draft' } : b
      )
    );
  };

  // ------------------- Render -------------------
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Blogs</h1>
        <Button onClick={() => setIsOpen(true)}>
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
              setFilterCategory(value === 'all' ? 'all' : parseInt(value))
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {mockCategories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id.toString()}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filterStatus}
            onValueChange={(value) =>
              setFilterStatus(value as 'all' | 'draft' | 'published')
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
            const category = mockCategories.find((c) => c.id === blog.categoryId);
            return (
              <TableRow key={blog.id}>
                <TableCell className="font-medium">{blog.title}</TableCell>
                <TableCell>{blog.author}</TableCell>
                <TableCell>{category?.name || 'Uncategorized'}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {blog.tags.map((tag, index) => (
                      <Badge key={index} variant="outline">{tag}</Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={blog.status === 'published' ? 'default' : 'secondary'}>
                    {blog.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(blog)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setPreviewOpen(true)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleToggleStatus(blog)}>
                      {blog.status === 'draft' ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(blog.id)}>
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
            <DialogTitle>{isEdit ? 'Edit Blog' : 'Create Blog'}</DialogTitle>
            <DialogDescription>
              {isEdit ? 'Update the blog details.' : 'Fill in the details to create a new blog.'}
            </DialogDescription>
          </DialogHeader>

          <BlogForm
            formData={formData}
            categories={mockCategories}
            onChange={handleInputChange}
            onSelectChange={handleSelectChange}
            onTagsChange={handleTagsChange}
          />

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {isEdit ? 'Save Changes' : 'Create Blog'}
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
