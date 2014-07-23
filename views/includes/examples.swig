{% block examples -%}
    {%- spaceless %}
        {% if examples && examples.length %}
            {# TODO: "examples-heading" or similar? #}
            {% block examples-content %}
                {# TODO: maybe make more subtle a la bootstrap docs #}
                <h {{ cssclass('examples') }}>
                    {{ translate('headings.examples', examples.length) }}
                </h>
                {% for example in examples %}
                    {# TODO: WIP #}
                    <div {{ cssclass('example') }}>
                        {% if example.caption %}
                            {# TODO: better markup for this #}
                            <p {{ cssclass('example-caption') }}>{{ example.caption }}</p>
                        {% endif %}
                        {# TODO: make sure example.code is HTML-escaped; see #511 #}
                        {# TODO: line numbers: https://github.com/jsdoc3/jsdoc/commit/8663cc42 #}
                        <pre {{ cssclass('prettyprint') }}><code>{{ example.code }}</code></pre>
                    </div>
                {% endfor %}
            {% endblock %}
        {% endif %}
    {% endspaceless -%}
{%- endblock %}
