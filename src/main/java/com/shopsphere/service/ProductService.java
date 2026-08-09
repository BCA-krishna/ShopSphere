package com.shopsphere.service;

import com.shopsphere.dto.ProductRequest;
import com.shopsphere.dto.ProductResponse;
import com.shopsphere.entity.Product;
import com.shopsphere.exception.ProductNotFoundException;
import com.shopsphere.repository.ProductRepository;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    private static final String UPLOAD_DIR = "uploads/";

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public ProductResponse addProduct(ProductRequest request) {

        Product product = new Product();

        MultipartFile image = request.getImage();

        if (image != null && !image.isEmpty()) {

            try {

                String fileName = image.getOriginalFilename();

                Path path = Paths.get(UPLOAD_DIR + fileName);

                Files.createDirectories(path.getParent());

                Files.write(path, image.getBytes());

                product.setImageUrl("/uploads/" + fileName);

            } catch (IOException e) {

                throw new RuntimeException("Failed to upload image");
            }
        }

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setStock(request.getStock());
        product.setCategory(request.getCategory());

        Product savedProduct = productRepository.save(product);

        return new ProductResponse(
                savedProduct.getId(),
                savedProduct.getName(),
                savedProduct.getDescription(),
                savedProduct.getPrice(),
                savedProduct.getStock(),
                savedProduct.getImageUrl(),
                savedProduct.getCategory()
        );
    }

    public Page<ProductResponse> getAllProducts(
            int page,
            int size,
            String sortBy,
            String direction
    ) {

        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Product> products = productRepository.findAll(pageable);

        return products.map(product -> new ProductResponse(
                product.getId(),
                product.getName(),
                product.getDescription(),
                product.getPrice(),
                product.getStock(),
                product.getImageUrl(),
                product.getCategory()
        ));
    }

    public ProductResponse getProductById(Long id) {

        Product product = productRepository.findById(id)
                .orElseThrow(() ->
                        new ProductNotFoundException("Product not found"));

        return new ProductResponse(
                product.getId(),
                product.getName(),
                product.getDescription(),
                product.getPrice(),
                product.getStock(),
                product.getImageUrl(),
                product.getCategory()
        );
    }

    public ProductResponse updateProduct(Long id, ProductRequest request) {

        Product product = productRepository.findById(id)
                .orElseThrow(() ->
                        new ProductNotFoundException("Product not found"));

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setStock(request.getStock());
        product.setCategory(request.getCategory());

        MultipartFile image = request.getImage();

        if (image != null && !image.isEmpty()) {

            try {

                String fileName = image.getOriginalFilename();

                Path path = Paths.get(UPLOAD_DIR + fileName);

                Files.createDirectories(path.getParent());

                Files.write(path, image.getBytes());

                product.setImageUrl("/uploads/" + fileName);

            } catch (IOException e) {

                throw new RuntimeException("Failed to upload image");
            }
        }

        Product updatedProduct = productRepository.save(product);

        return new ProductResponse(
                updatedProduct.getId(),
                updatedProduct.getName(),
                updatedProduct.getDescription(),
                updatedProduct.getPrice(),
                updatedProduct.getStock(),
                updatedProduct.getImageUrl(),
                updatedProduct.getCategory()
        );
    }

    public void deleteProduct(Long id) {

        Product product = productRepository.findById(id)
                .orElseThrow(() ->
                        new ProductNotFoundException("Product not found"));

        productRepository.delete(product);
    }

    public List<ProductResponse> searchProducts(String keyword) {

        List<Product> products =
                productRepository.findByNameContainingIgnoreCase(keyword);

        return products.stream()
                .map(product -> new ProductResponse(
                        product.getId(),
                        product.getName(),
                        product.getDescription(),
                        product.getPrice(),
                        product.getStock(),
                        product.getImageUrl(),
                        product.getCategory()
                ))
                .toList();
    }

    public List<ProductResponse> getProductsByCategory(String category) {

        List<Product> products =
                productRepository.findByCategoryIgnoreCase(category);

        return products.stream()
                .map(product -> new ProductResponse(
                        product.getId(),
                        product.getName(),
                        product.getDescription(),
                        product.getPrice(),
                        product.getStock(),
                        product.getImageUrl(),
                        product.getCategory()
                ))
                .toList();
    }

    public List<String> getAllCategories() {

        return productRepository.getAllCategories();

    }
}
