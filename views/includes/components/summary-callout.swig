{% macro column(columnItems) %}
{% endmacro %}

{% macro columns(items) %}
    {% set COLUMN_COUNT = 3 %}
    {# use multiple columns only if the number of items meets the threshold #}
    {% set COLUMN_THRESHOLD = 5 %}

    {% if items.length >= COLUMN_THRESHOLD %}
        {% set itemsPerColumn = Math.ceil(items.length / COLUMN_COUNT) %}
    {% else %}
        {% set itemsPerColumn = items.length %}
    {% endif %}

    {% set columnGroups = items|group(itemsPerColumn, COLUMN_COUNT) %}
    {% for columnGroup in columnGroups %}
        <div {{ cssClass('!summary-column') }}>
            {% if columnGroup.length %}
                <dl {{ cssClass('!dl-summary-callout') }}>
                    {% for columnItem in columnGroup %}
                        {% set itemName = columnItem.name %}
                        <dt>
                            {% spaceless %}
                                {{ link(columnItem.id, columnItem.name)|safe }}
                                {#
                                    TODO: make the signature optional? that would create some
                                    confusion for overloaded methods...
                                #}
                                {# TODO: make the signature part of the link #}
                                {{ macros.signature(columnItem)|safe|striptags }}
                            {% endspaceless %}
                        </dt>
                        {% if columnItem.summary %}
                            <dd>{% include '../summary.swig' with columnItem %}</dd>
                        {% endif %}
                    {% endfor %}
                </dl>
            {% endif %}
        </div>
    {% endfor %}
{% endmacro %}

{% block summary-callout %}
    {% if summaryItems && summaryItems.length %}
        <div {{ cssClass('!summary-callout') }}>
            {% block summary-callout-heading %}
                {% if summaryHeading %}
                    <h {{ cssClass('!summary-callout-heading') }}>{{ summaryHeading }}</h>
                {% endif %}
            {% endblock %}

            {% block summary-callout-content %}
                <div {{ cssClass('!summary-content') }}>
                    {{ columns(summaryItems) }}
                </div>
            {% endblock %}
        </div>
    {% endif %}
{% endblock %}
