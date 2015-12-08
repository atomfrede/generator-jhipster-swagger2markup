package <%=packageName%>.web.rest;

import com.mycompany.myapp.Application;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.IntegrationTest;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;
import springfox.documentation.staticdocs.Swagger2MarkupResultHandler;

import javax.inject.Inject;
import java.io.File;
import java.io.IOException;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = Application.class)
@WebAppConfiguration
@IntegrationTest
public class Swagger2MarkupTest {

    @Inject
    private WebApplicationContext context;

    private MockMvc mockMvc;

    private File projectDir;

    @Before
    public void setup() throws IOException {
        this.mockMvc = MockMvcBuilders.webAppContextSetup(this.context).build();

        ClassPathResource pathfileRes = new ClassPathResource("config/application-dev.yml");
        projectDir = pathfileRes.getFile().getParentFile().getParentFile().getParentFile().getParentFile();
    }


    @Test
    public void convertSwaggerToAsciiDoc() throws Exception {
        this.mockMvc.perform(get("/v2/api-docs")
            .accept(MediaType.APPLICATION_JSON))
            .andDo(Swagger2MarkupResultHandler
                .outputDirectory("src/docs/asciidoc/generated").build())
            .andExpect(status().isOk());
    }

    private String outputDirForFormat(String format) throws IOException {
        return new File(projectDir, "docs/" + format + "/generated").getAbsolutePath();
    }
}
