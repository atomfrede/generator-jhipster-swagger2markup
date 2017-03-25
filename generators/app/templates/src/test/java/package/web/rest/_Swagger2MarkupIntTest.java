package <%=packageName%>.web.rest;

import <%=packageName%>.<%= mainClass %>;
import org.junit.Before;
<%_ if (springRestDocSamples) { _%>
import org.junit.Rule;
<%_ } _%>
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
<%_ if (springRestDocSamples) { _%>
import org.springframework.restdocs.JUnitRestDocumentation;
<%_ } _%>
import org.springframework.test.context.ActiveProfiles;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;
import springfox.documentation.staticdocs.SwaggerResultHandler;

<%_ if (springRestDocSamples) { _%>
import static org.springframework.restdocs.mockmvc.MockMvcRestDocumentation.document;
import static org.springframework.restdocs.mockmvc.MockMvcRestDocumentation.documentationConfiguration;
import static org.springframework.restdocs.operation.preprocess.Preprocessors.preprocessResponse;
import static org.springframework.restdocs.operation.preprocess.Preprocessors.prettyPrint;
<%_ } _%>
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = <%= mainClass %>.class)
@AutoConfigureMockMvc
@ActiveProfiles("swagger,s2m")
public class Swagger2MarkupIntTest {

    <%_ if (springRestDocSamples && buildTool == 'gradle') { _%>
    @Rule
    public final JUnitRestDocumentation restDocumentation = new JUnitRestDocumentation("build/asciidoc/snippets");
    <%_ } _%>
    <%_ if (springRestDocSamples && buildTool == 'maven') { _%>
    @Rule
    public final JUnitRestDocumentation restDocumentation = new JUnitRestDocumentation("target/docs/asciidoc/snippets");
    <%_ } _%>

    @Autowired
    private WebApplicationContext context;
    @Autowired
    private MockMvc mockMvc;

    @Before
    public void setup() {
        this.mockMvc = MockMvcBuilders.webAppContextSetup(this.context)
        <%_ if (springRestDocSamples) { _%>.apply(documentationConfiguration(this.restDocumentation))<%_ } _%>
        .build();
    }

    <%_ if (springRestDocSamples) { _%>
    @Test
    public void getAllUsersSamples() throws Exception {
        this.mockMvc.perform(get("/api/users")
          .accept(MediaType.APPLICATION_JSON))
          .andDo(document("getAllUsersUsingGET", preprocessResponse(prettyPrint())))
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
