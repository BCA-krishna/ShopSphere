package com.shopsphere.service;

import com.shopsphere.dto.ProductRequest;
import com.shopsphere.dto.ProductResponse;
import com.shopsphere.entity.Product;
import com.shopsphere.exception.ProductNotFoundException;
import com.shopsphere.repository.ProductRepository;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.util.Comparator;

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

        if (keyword == null || keyword.trim().isEmpty()) {
            return List.of();
        }

        String searchTerm = keyword.trim().toLowerCase();

        // First: normal database search
        List<Product> exactMatches =
                productRepository.findByNameContainingIgnoreCase(searchTerm);

        // If normal search found products, return them
        if (!exactMatches.isEmpty()) {
            return exactMatches.stream()
                    .map(this::toProductResponse)
                    .toList();
        }

        // No normal match -> fuzzy search
        List<Product> allProducts = productRepository.findAll();

        return allProducts.stream()
                .map(product -> new ProductMatch(
                        product,
                        calculateSimilarity(
                                searchTerm,
                                product.getName()
                        )
                ))
                .filter(match -> match.score >= 0.55)
                .sorted(Comparator.comparingDouble(
                        ProductMatch::getScore
                ).reversed())
                .map(match -> toProductResponse(match.product))
                .toList();
    }
    private ProductResponse toProductResponse(Product product) {

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
    private double calculateSimilarity(String searchTerm, String productName) {

        if (productName == null || productName.isBlank()) {
            return 0.0;
        }

        String normalizedSearch = searchTerm
                .toLowerCase()
                .trim();

        String normalizedName = productName
                .toLowerCase()
                .trim();

        // Exact product-name substring
        if (normalizedName.contains(normalizedSearch)) {
            return 1.0;
        }

        String[] words = normalizedName.split("\\s+");

        double bestScore = 0.0;

        for (String word : words) {

            if (word.isBlank()) {
                continue;
            }

            int distance =
                    levenshteinDistance(normalizedSearch, word);

            int maxLength = Math.max(
                    normalizedSearch.length(),
                    word.length()
            );

            if (maxLength == 0) {
                continue;
            }

            double score =
                    1.0 - ((double) distance / maxLength);

            bestScore = Math.max(bestScore, score);
        }

        return bestScore;
    }
    private int levenshteinDistance(String a, String b) {

        int[][] dp = new int[a.length() + 1][b.length() + 1];

        for (int i = 0; i <= a.length(); i++) {
            dp[i][0] = i;
        }

        for (int j = 0; j <= b.length(); j++) {
            dp[0][j] = j;
        }

        for (int i = 1; i <= a.length(); i++) {

            for (int j = 1; j <= b.length(); j++) {

                int cost =
                        a.charAt(i - 1) == b.charAt(j - 1)
                                ? 0
                                : 1;

                dp[i][j] = Math.min(
                        Math.min(
                                dp[i - 1][j] + 1,
                                dp[i][j - 1] + 1
                        ),
                        dp[i - 1][j - 1] + cost
                );
            }
        }

        return dp[a.length()][b.length()];
    }

    private static class ProductMatch {

        private final Product product;
        private final double score;

        public ProductMatch(Product product, double score) {
            this.product = product;
            this.score = score;
        }

        public double getScore() {
            return score;
        }
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
