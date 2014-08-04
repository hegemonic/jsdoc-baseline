{% import '../../macros.swig' as macros %}

<div {{ cssClass('!summary-column') }}>
    {% if columnGroup.length %}
        <dl {{ cssClass('!dl-summary-callout') }}>
            {% for columnGroupItem in columnGroup %}
                <dt>
                    {% spaceless %}
                        {{ link(columnGroupItem.longname, columnGroupItem.name)|safe }}
                        {# TODO: make the signature part of the link #}
                        {{ macros.signature(columnGroupItem)|safe|striptags }}
                    {% endspaceless %}
                </dt>
                {# Always include <dd> tag, which is required for validity #}
                <dd>
                    {% if columnGroupItem.summary %}
                        {% set context = { summary: columnGroupItem.summary } %}
                        {% include '../summary.swig' with context only %}
                    {% endif %}
                </dd>
            {% endfor %}
        </dl>
    {% endif %}
</div>
