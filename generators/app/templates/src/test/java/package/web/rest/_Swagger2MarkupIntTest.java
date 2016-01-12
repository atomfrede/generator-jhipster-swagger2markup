package <%=packageName%>.web.rest;

import <%=packageName%>.Application;
import org.junit.Before;
<%_ if (springRestDocSamples) { _%>
import org.junit.Rule;
<%_ } _%>
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.IntegrationTest;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.MediaType;
<%_ if (springRestDocSamples) { _%>
import org.springframework.restdocs.RestDocumentation;
<%_ } _%>
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;
import springfox.documentation.staticdocs.SwaggerResultHandler;

import javax.inject.Inject;
import java.io.File;
import java.io.IOException;

<%_ if (springRestDocSamples) { _%>
import static org.springframework.restdocs.mockmvc.MockMvcRestDocumentation.document;
import static org.springframework.restdocs.mockmvc.MockMvcRestDocumentation.documentationConfiguration;
import static org.springframework.restdocs.operation.preprocess.Preprocessors.preprocessResponse;
import static org.springframework.restdocs.operation.preprocess.Preprocessors.prettyPrint;
<%_ } _%>
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = Application.class)
@WebAppConfiguration
@IntegrationTest
public class Swagger2MarkupIntTest {

    <%_ if (springRestDocSamples && buildTool == 'gradle') { _%>
    @Rule
    public final RestDocumentation restDocumentation = new RestDocumentation("build/asciidoc");
    <%_ } _%>
    <%_ if (springRestDocSamples && buildTool == 'maven') { _%>
    @Rule
    public final RestDocumentation restDocumentation = new RestDocumentation("target/asciidoc");
    <%_ } _%>

    @Inject
    private WebApplicationContext context;

    private MockMvc mockMvc;

    @Before
    public void setup() throws IOException {
        this.mockMvc = MockMvcBuilders.webAppContextSetup(this.context)
        <%_ if (springRestDocSamples) { _%>.apply(documentationConfiguration(this.restDocumentation))<%_ } _%>
        .build();
    }

    <%_ if (springRestDocSamples) { _%>
    @Test
    public void getAllUsersSamples() throws Exception {
        this.mockMvc.perform(get("/api/users")
          .accept(MediaType.APPLICATION_JSON))
          .andDo(document("getallusers", preprocessResponse(prettyPrint())))
          .andExpect(status().isOk());
    }<%_ } _%>

    @Test
    public void convertSwaggerToAsciiDoc() throws Exception {
        this.mockMvc.perform(get("/v2/api-docs")
            .accept(MediaType.APPLICATION_JSON))
            .andDo(SwaggerResultHandler.outputDirectory(<%_ if (buildTool == 'gradle') { _%>"build/swagger"<%_ } else { _%>"target/swagger"<%_ } _%>)
            .build())
            .andExpect(status().isOk());
    }
}
