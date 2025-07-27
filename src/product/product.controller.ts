import { 
  Body, 
  Controller, 
  Delete, 
  Param, 
  Post, 
  Query, 
  Get, 
  Put, 
  ParseIntPipe,
  HttpStatus,
  HttpCode
} from '@nestjs/common';
import { ProductService } from './product.service';
import {
  CreateProductDto,
  UpdateProductDto,
  ProductResponseDto,
  ProductDetailDto
} from './product.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Post('createProduct')
  @HttpCode(HttpStatus.CREATED)
  async createProduct(@Body() createProductDto: CreateProductDto): Promise<ProductResponseDto> {
    return await this.productService.createProduct(createProductDto);
  }

  @Get('getAllProducts')
  async getAllProducts(): Promise<ProductResponseDto[]> {
    return await this.productService.getAllProducts();
  }

  @Get('getProductById/:id')
  async getProductById(@Param('id', ParseIntPipe) id: number): Promise<ProductResponseDto> {
    return await this.productService.getProductById(id);
  }

  @Get('getProductDetail/:id')
  async getProductDetail(@Param('id', ParseIntPipe) id: number): Promise<ProductDetailDto> {
    return await this.productService.getProductDetail(id);
  }

  @Put('updateProduct/:id')
  async updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto
  ): Promise<ProductResponseDto> {
    return await this.productService.updateProduct(id, updateProductDto);
  }

  @Put('updateProductStock/:id')
  async updateProductStock(
    @Param('id', ParseIntPipe) id: number,
    @Body('stock') stock: number
  ): Promise<ProductResponseDto> {
    return await this.productService.updateProductStock(id, stock);
  }

  @Put('toggleProductAvailability/:id')
  async toggleProductAvailability(@Param('id', ParseIntPipe) id: number): Promise<ProductResponseDto> {
    return await this.productService.toggleProductAvailability(id);
  }

  @Delete('deleteProductById/:id')
  @HttpCode(HttpStatus.OK)
  async deleteProductById(@Param('id', ParseIntPipe) id: number): Promise<{ success: boolean; message: string }> {
    const success = await this.productService.deleteProduct(id);
    return {
      success,
      message: success ? 'Product deleted successfully' : 'Failed to delete product'
    };
  }

  @Get('getProductsByCategory')
  async getProductsByCategory(@Query('category') category: string): Promise<ProductResponseDto[]> {
    return await this.productService.getProductsByCategory(category);
  }

  @Get('getProductsByName')
  async getProductsByName(@Query('name') name: string): Promise<ProductResponseDto[]> {
    return await this.productService.getProductsByName(name);
  }

  @Get('getAvailableProducts')
  async getAvailableProducts(): Promise<ProductResponseDto[]> {
    return await this.productService.getAvailableProducts();
  }

  @Get('getProductsByBrand')
  async getProductsByBrand(@Query('brand') brand: string): Promise<ProductResponseDto[]> {
    return await this.productService.getProductsByBrand(brand);
  }

  @Get('getProductsInStock')
  async getProductsInStock(): Promise<ProductResponseDto[]> {
    return await this.productService.getProductsInStock();
  }
} 