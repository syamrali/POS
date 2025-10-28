import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Plus, Edit, Trash2, FolderPlus, Tag, Download, Upload, FileSpreadsheet } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog";
import * as api from "../services/api";

interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  department: string;
  description: string;
}

interface Department {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
}

const initialMenuItems: MenuItem[] = [
  { id: "1", name: "Classic Burger", price: 259, category: "Mains", department: "Kitchen", description: "Beef patty with lettuce, tomato, cheese" },
  { id: "2", name: "Caesar Salad", price: 199, category: "Salads", department: "Kitchen", description: "Romaine lettuce, croutons, parmesan" },
  { id: "3", name: "Margherita Pizza", price: 299, category: "Mains", department: "Kitchen", description: "Fresh mozzarella, basil, tomato sauce" },
  { id: "4", name: "Fish & Chips", price: 319, category: "Mains", department: "Kitchen", description: "Beer-battered fish with crispy fries" },
  { id: "5", name: "Greek Salad", price: 219, category: "Salads", department: "Kitchen", description: "Feta, olives, cucumber, tomatoes" },
  { id: "6", name: "Pasta Carbonara", price: 279, category: "Mains", department: "Kitchen", description: "Creamy sauce with bacon and parmesan" },
  { id: "7", name: "Coca Cola", price: 59, category: "Beverages", department: "Bar", description: "330ml can" },
  { id: "8", name: "Fresh Orange Juice", price: 99, category: "Beverages", department: "Bar", description: "Freshly squeezed" },
  { id: "9", name: "Chocolate Cake", price: 139, category: "Desserts", department: "Kitchen", description: "Rich chocolate layer cake" },
  { id: "10", name: "Ice Cream Sundae", price: 119, category: "Desserts", department: "Kitchen", description: "Vanilla ice cream with toppings" },
];

const initialDepartments: Department[] = [
  { id: "1", name: "Kitchen" },
  { id: "2", name: "Bar" },
  { id: "3", name: "Grill" },
];

const initialCategories: Category[] = [
  { id: "1", name: "Mains" },
  { id: "2", name: "Salads" },
  { id: "3", name: "Beverages" },
  { id: "4", name: "Desserts" },
  { id: "5", name: "Appetizers" },
];

export function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<MenuItem | null>(null);
  
  const [deptDialogOpen, setDeptDialogOpen] = useState(false);
  const [catDialogOpen, setCatDialogOpen] = useState(false);
  const [newDeptName, setNewDeptName] = useState("");
  const [newCatName, setNewCatName] = useState("");
  
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [importing, setImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    department: "",
    description: "",
  });

  // Load data from API on component mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [itemsData, categoriesData, departmentsData] = await Promise.all([
        api.getMenuItems(),
        api.getCategories(),
        api.getDepartments(),
      ]);
      
      setMenuItems(itemsData);
      setCategories(categoriesData);
      setDepartments(departmentsData);
      
      // Set default form values if categories/departments exist
      if (categoriesData.length > 0 && departmentsData.length > 0) {
        setFormData(prev => ({
          ...prev,
          category: categoriesData[0].name,
          department: departmentsData[0].name,
        }));
      }
    } catch (error) {
      console.error("Error loading menu data:", error);
      alert("Failed to load menu data. Please refresh the page.");
    }
  };

  const filteredItems = selectedCategory === "All" 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({ 
      name: "", 
      price: "", 
      category: categories[0]?.name || "", 
      department: departments[0]?.name || "",
      description: "" 
    });
    setDialogOpen(true);
  };

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      price: item.price.toString(),
      category: item.category,
      department: item.department,
      description: item.description,
    });
    setDialogOpen(true);
  };

  const handleDelete = (item: MenuItem) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (itemToDelete) {
      try {
        await api.deleteMenuItem(itemToDelete.id);
        setMenuItems(prev => prev.filter(i => i.id !== itemToDelete.id));
        setDeleteDialogOpen(false);
        setItemToDelete(null);
      } catch (error) {
        console.error("Error deleting menu item:", error);
        alert("Failed to delete menu item. Please try again.");
      }
    }
  };

  const handleSave = async () => {
    if (!formData.name || !formData.price) {
      alert("Please fill in all required fields");
      return;
    }

    const price = parseFloat(formData.price);
    if (isNaN(price) || price < 0) {
      alert("Please enter a valid price");
      return;
    }

    try {
      if (editingItem) {
        const updatedItem = await api.updateMenuItem(editingItem.id, {
          name: formData.name, 
          price, 
          category: formData.category, 
          department: formData.department,
          description: formData.description 
        });
        setMenuItems(prev =>
          prev.map(item =>
            item.id === editingItem.id ? updatedItem : item
          )
        );
      } else {
        const newItem = await api.createMenuItem({
          name: formData.name,
          price,
          category: formData.category,
          department: formData.department,
          description: formData.description,
        });
        setMenuItems(prev => [...prev, newItem]);
      }

      setDialogOpen(false);
      setFormData({ name: "", price: "", category: categories[0]?.name || "", department: departments[0]?.name || "", description: "" });
    } catch (error) {
      console.error("Error saving menu item:", error);
      alert("Failed to save menu item. Please try again.");
    }
  };

  const handleAddDepartment = async () => {
    if (!newDeptName.trim()) {
      alert("Please enter a department name");
      return;
    }
    try {
      const newDept = await api.createDepartment({ name: newDeptName.trim() });
      setDepartments(prev => [...prev, newDept]);
      setNewDeptName("");
      setDeptDialogOpen(false);
    } catch (error) {
      console.error("Error creating department:", error);
      alert("Failed to create department. Please try again.");
    }
  };

  const handleDeleteDepartment = async (dept: Department) => {
    if (confirm(`Delete department "${dept.name}"?`)) {
      try {
        await api.deleteDepartment(dept.id);
        setDepartments(prev => prev.filter(d => d.id !== dept.id));
      } catch (error) {
        console.error("Error deleting department:", error);
        alert("Failed to delete department. Please try again.");
      }
    }
  };

  const handleAddCategory = async () => {
    if (!newCatName.trim()) {
      alert("Please enter a category name");
      return;
    }
    try {
      const newCat = await api.createCategory({ name: newCatName.trim() });
      setCategories(prev => [...prev, newCat]);
      setNewCatName("");
      setCatDialogOpen(false);
    } catch (error) {
      console.error("Error creating category:", error);
      alert("Failed to create category. Please try again.");
    }
  };

  const handleDeleteCategory = async (cat: Category) => {
    if (confirm(`Delete category "${cat.name}"?`)) {
      try {
        await api.deleteCategory(cat.id);
        setCategories(prev => prev.filter(c => c.id !== cat.id));
      } catch (error) {
        console.error("Error deleting category:", error);
        alert("Failed to delete category. Please try again.");
      }
    }
  };

  // Excel Import/Export handlers
  const handleDownloadTemplate = async () => {
    try {
      const blob = await api.downloadMenuTemplate();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'menu_import_template.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading template:", error);
      alert("Failed to download template. Please try again.");
    }
  };

  const handleExportData = async () => {
    try {
      const blob = await api.exportMenuData();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'menu_data_export.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error exporting data:", error);
      alert("Failed to export data. Please try again.");
    }
  };

  const handleImportFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImporting(true);
    try {
      const result = await api.importMenuData(file);
      
      if (result.success) {
        // Reload data after successful import
        await loadData();
        
        let message = `Import completed successfully!\n\n`;
        message += `✅ Categories added: ${result.stats.categories_added}\n`;
        message += `✅ Departments added: ${result.stats.departments_added}\n`;
        message += `✅ Menu items added: ${result.stats.items_added}`;
        
        if (result.stats.errors && result.stats.errors.length > 0) {
          message += '\n\nWarning - Errors occurred:\n' + result.stats.errors.join('\n');
        }
        
        alert(message);
        setImportDialogOpen(false);
      } else {
        alert("Import failed. Please check the file format and try again.");
      }
    } catch (error) {
      console.error("Error importing file:", error);
      alert("Failed to import file. Please check the file format and try again.");
    } finally {
      setImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const categoryStats = categories.map(cat => ({
    name: cat.name,
    count: menuItems.filter(item => item.category === cat.name).length,
  }));

  return (
    <div className="p-6">
      <Tabs defaultValue="items" className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-gray-900 mb-2">Menu Management</h2>
            <p className="text-muted-foreground">Manage menu items, departments, and categories</p>
          </div>
          <TabsList>
            <TabsTrigger value="items">Menu Items</TabsTrigger>
            <TabsTrigger value="departments">Departments</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
          </TabsList>
        </div>

        {/* Menu Items Tab */}
        <TabsContent value="items" className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <Button
                onClick={() => setDeptDialogOpen(true)}
                variant="outline"
              >
                <FolderPlus className="size-4 mr-2" />
                Add Department
              </Button>
              <Button
                onClick={() => setCatDialogOpen(true)}
                variant="outline"
              >
                <Tag className="size-4 mr-2" />
                Add Category
              </Button>
              <Button
                onClick={() => setImportDialogOpen(true)}
                variant="outline"
                className="border-green-600 text-green-600 hover:bg-green-50"
              >
                <FileSpreadsheet className="size-4 mr-2" />
                Bulk Import
              </Button>
              <Button
                onClick={handleExportData}
                variant="outline"
                className="border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                <Download className="size-4 mr-2" />
                Export Data
              </Button>
            </div>
            <Button
              onClick={handleAdd}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              <Plus className="size-4 mr-2" />
              Add Item
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categoryStats.map(stat => (
              <Card key={stat.name} className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-100">
                <CardContent className="p-4">
                  <p className="text-muted-foreground mb-1">{stat.name}</p>
                  <p className="text-purple-600">{stat.count} items</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={selectedCategory === "All" ? "default" : "outline"}
              onClick={() => setSelectedCategory("All")}
              className={selectedCategory === "All" 
                ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                : ""
              }
            >
              All
            </Button>
            {categories.map(category => (
              <Button
                key={category.id}
                variant={selectedCategory === category.name ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.name)}
                className={selectedCategory === category.name 
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                  : ""
                }
              >
                {category.name}
              </Button>
            ))}
          </div>

          {/* Menu Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map(item => (
              <Card key={item.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-gray-900">{item.name}</CardTitle>
                      <div className="flex gap-1 mt-1">
                        <Badge variant="secondary">{item.category}</Badge>
                        <Badge variant="outline">{item.department}</Badge>
                      </div>
                    </div>
                    <p className="text-purple-600">₹{item.price}</p>
                  </div>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(item)}
                      className="flex-1"
                    >
                      <Edit className="size-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(item)}
                      className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="size-3 mr-1" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Departments Tab */}
        <TabsContent value="departments">
          <div className="max-w-2xl">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-gray-900 mb-1">Departments</h3>
                <p className="text-muted-foreground">Manage kitchen departments</p>
              </div>
              <Button
                onClick={() => setDeptDialogOpen(true)}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <Plus className="size-4 mr-2" />
                Add Department
              </Button>
            </div>
            <div className="grid gap-3">
              {departments.map(dept => (
                <Card key={dept.id}>
                  <CardContent className="p-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-full bg-purple-100 flex items-center justify-center">
                        <FolderPlus className="size-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-gray-900">{dept.name}</p>
                        <p className="text-muted-foreground">
                          {menuItems.filter(item => item.department === dept.name).length} items
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteDepartment(dept)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Categories Tab */}
        <TabsContent value="categories">
          <div className="max-w-2xl">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-gray-900 mb-1">Categories</h3>
                <p className="text-muted-foreground">Manage menu categories</p>
              </div>
              <Button
                onClick={() => setCatDialogOpen(true)}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <Plus className="size-4 mr-2" />
                Add Category
              </Button>
            </div>
            <div className="grid gap-3">
              {categories.map(cat => (
                <Card key={cat.id}>
                  <CardContent className="p-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-full bg-pink-100 flex items-center justify-center">
                        <Tag className="size-5 text-pink-600" />
                      </div>
                      <div>
                        <p className="text-gray-900">{cat.name}</p>
                        <p className="text-muted-foreground">
                          {menuItems.filter(item => item.category === cat.name).length} items
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteCategory(cat)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Add/Edit Item Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingItem ? "Edit Menu Item" : "Add New Menu Item"}</DialogTitle>
            <DialogDescription>
              {editingItem ? "Update menu item information" : "Enter the details for the new menu item"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Item Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Classic Burger"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price (₹) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Department *</Label>
              <Select value={formData.department} onValueChange={(value) => setFormData({ ...formData, department: value })}>
                <SelectTrigger id="department">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {departments.map(dept => (
                    <SelectItem key={dept.id} value={dept.name}>{dept.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger id="category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Brief description of the item"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {editingItem ? "Save Changes" : "Add Item"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Department Dialog */}
      <Dialog open={deptDialogOpen} onOpenChange={setDeptDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Department</DialogTitle>
            <DialogDescription>
              Enter the name for the new department
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="dept-name">Department Name</Label>
            <Input
              id="dept-name"
              placeholder="e.g., Kitchen, Bar, Grill"
              value={newDeptName}
              onChange={(e) => setNewDeptName(e.target.value)}
              className="mt-2"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeptDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddDepartment}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              Add Department
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Category Dialog */}
      <Dialog open={catDialogOpen} onOpenChange={setCatDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
            <DialogDescription>
              Enter the name for the new category
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="cat-name">Category Name</Label>
            <Input
              id="cat-name"
              placeholder="e.g., Appetizers, Mains, Desserts"
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              className="mt-2"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCatDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddCategory}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              Add Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Menu Item</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{itemToDelete?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Import Dialog */}
      <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Bulk Import Menu Data</DialogTitle>
            <DialogDescription>
              Import menu items, categories, and departments from an Excel file
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-blue-900 font-medium mb-2">📋 How to use:</p>
              <ol className="text-blue-700 space-y-1 text-sm list-decimal list-inside">
                <li>Download the Excel template</li>
                <li>Fill in your data in the template</li>
                <li>Upload the completed file</li>
              </ol>
            </div>

            <Button
              onClick={handleDownloadTemplate}
              variant="outline"
              className="w-full border-purple-600 text-purple-600 hover:bg-purple-50"
            >
              <Download className="size-4 mr-2" />
              Download Excel Template
            </Button>

            <div className="relative">
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                onChange={handleImportFile}
                className="hidden"
                id="file-upload"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={importing}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
              >
                {importing ? (
                  <>Processing...</>
                ) : (
                  <>
                    <Upload className="size-4 mr-2" />
                    Upload Filled Excel File
                  </>
                )}
              </Button>
            </div>

            <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-yellow-900 text-sm">
                ⚠️ Note: Categories and Departments must be created before menu items that reference them.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setImportDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
