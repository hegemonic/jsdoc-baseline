{% import '../../macros.swig' as macros %}

<div {{ cssClass('!summary-column') }}>
    {% if columnGroup.length %}
        <dl {{ cssClass('!dl-summary-callout') }}>
            {% for columnGroupItem in columnGroup %}
                <dt>
                    {% spaceless %}
                        {{ link(columnGroupItem.id, columnGroupItem.name)|safe }}
                        {#
                            TODO: make the signature optional? that would create
                            some confusion for overloaded methods...
                        #}
                        {# TODO: make the signature part of the link #}
                        {{ macros.signature(columnGroupItem)|safe|striptags }}
                    {% endspaceless %}
                </dt>
                {% if columnGroupItem.summary %}
                    {% set context = { summary: columnGroupItem.summary } %}
                    <dd>{% include '../summary.swig' with context only %}</dd>
                {% endif %}
            {% endfor %}
        </dl>
    {% endif %}
</div>
