<h {{ headingId|safe }}>{{ headingText|safe }}</h>
<dl {{ cssClass('!symbol-index-list') }}>
    {% for doclet in doclets %}
        <dt {{ cssClass('!symbol-index-name') }}>
            {% spaceless %}
                {% set linkClass = cssClass('!symbol-index-name') %}
                {{ link(doclet.longname, doclet.longname|stripNamespace)|safe }}
                {# TODO: make the signature part of the link #}
                {{ macros.signature(doclet)|safe|striptags }}
            {% endspaceless %}
        </dt>
        {# Always include <dd> tag, which is required for validity #}
        <dd>
            {% if doclet.summary %}
                {% set context = { summary: doclet.summary } %}
                {% include '../summary.swig' with context only %}
            {% endif %}
        </dd>
    {% endfor %}
</dl>
