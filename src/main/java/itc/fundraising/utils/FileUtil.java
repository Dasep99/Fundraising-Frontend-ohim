package itc.fundraising.utils;

import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Component
public class FileUtil {

    public static final String UPLOAD_DIR = "src/main/java/itc/fundraising/image";

    public String createFile(MultipartFile file, String subFolder) {
        Path directoryPath = Paths.get(UPLOAD_DIR, subFolder);
        createDirectoryPath(directoryPath);

        return upload(file, directoryPath);
    }

    public String updateFile(MultipartFile file, String oldFilename, String subFolder) {
        Path directoryPath = Paths.get(UPLOAD_DIR, subFolder);
        createDirectoryPath(directoryPath);

        try {
            Path oldFilePath = directoryPath.resolve(oldFilename);
            Files.delete(oldFilePath);
        } catch (IOException e) {
            System.err.println("Gagal menghapus file: " + e.getMessage());
        }

        return upload(file, directoryPath);
    }

    public void deleteFile(String filename, String subFolder) {
        Path directoryPath = Paths.get(FileUtil.UPLOAD_DIR, subFolder);

        try {
            Path filePath = directoryPath.resolve(filename);
            Files.delete(filePath);
        } catch (IOException e) {
            System.err.println("Gagal menghapus file: " + e.getMessage());
        }
    }

    private String upload(MultipartFile file, Path directoryPath) {
        if (file != null && !file.isEmpty()) {
            String newFilename = UUID.randomUUID() + "-" + file.getOriginalFilename();
            Path filePath = directoryPath.resolve(newFilename);

            try {
                Files.write(filePath, file.getBytes());
            } catch (IOException e) {
                throw new RuntimeException("Gagal meng-upload file: " + filePath, e);
            }

            return newFilename;
        }

        return null;
    }

    private void createDirectoryPath(Path directoryPath) {
        if (!Files.exists(directoryPath)) {
            try {
                Files.createDirectories(directoryPath);
            } catch (IOException e) {
                throw new RuntimeException("Gagal membuat folder: " + directoryPath, e);
            }
        }
    }

}
