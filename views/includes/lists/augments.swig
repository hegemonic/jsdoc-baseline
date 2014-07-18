{% import '../../macros.swig' as macros %}

{% block augments %}
	{% if augments && augments.length %}
		{% block augments-content %}
            <dt>Extends</dt>
            {{ macros.listitems(augments, { needsLink: true }) }}
        {% endblock %}
	{% endif %}
{% endblock %}
