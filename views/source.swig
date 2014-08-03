{% extends 'layout.swig' %}

{% block main-content %}
    {% block source %}
        {% block source-heading %}
            <header {{ cssClass('!page-header') }}>
                <h {{ cssClass('page-title') }}>{{ pageTitle }}</h>
            </header>
        {% endblock %}

        {% block source-content -%}
            <article>
                {%- spaceless %}
                    <pre {{ cssClass('!prettyprint', '!linenums', 'source') }}><code>
                        {{ docs }}
                    </code></pre>
                {% endspaceless -%}
            </article>
        {%- endblock %}
    {% endblock %}
{% endblock %}
